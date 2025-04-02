import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';
import * as argon2 from 'argon2';
import { createJWT } from '../../../libs/jwt';
import { UserService } from '../../Users/service/UsersService';
import { authSignupSchema } from '../../../schemas/auth-signup';
import { authSigninSchema } from '../../../schemas/auth-signin';
import { ExtendedRequest } from '../../../types/extended-request';

export class AuthController {
  private authService: AuthService;
  private userService: UserService;
  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  async signin(req: Request, res: Response) {
    try {
      const data = authSigninSchema.parse(req.body);
      const { email, password } = data;
      const user = await this.authService.findByEmail(email);
      console.log(user)
      if (!user) {
        res.status(401).json({ error: 'Email ou senha inválidos' });
        return;
      }

      const validPassword = await argon2.verify(user.password, password);
      if (!validPassword) {
        res.status(401).json({ error: 'Email ou senha inválidos' });
        return;
      }

      const token = createJWT(user.id);

      console.log(token)
      // Configurando o cookie para manter o usuario logado
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em milissegundos
      });

      res.status(200).json({ message: 'Login realizado com sucesso' });
      return;
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Erro ao realizar login' });
      return;
    }
  }

  async signup(req: Request, res: Response) {
      
    try {
      const data = authSignupSchema.parse(req.body);
      const { name, email, password } = data;

      const existingUser = await this.authService.findByEmail(email);

      if (existingUser) {
        res.status(409).json({ error: 'Email já cadastrado' });
        return;
      }

      // Encriptando a senha
      const hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1
      });

      const user = await this.userService.createUser({
        name,
        email,
        password: hashedPassword
      });

      res.status(201).json({ 
       user: user
      });
      return;
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Erro ao criar usuário' });
      return;
    }
  }

  async logout(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
        res.status(401).json({ error: 'Acesso negado' });
        return;
    }
    try {
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      
      res.status(200).json({ message: 'Logout realizado com sucesso' });
      return;
    } catch (error) {
      res.status(500).json({ error: 'Erro ao realizar logout' });
      return;
    }
  }

  async verify(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: 'Acesso Negado' });
      return;
    } else {
      res.status(200).json({message: 'Acesso Autorizado'})
      return;
    }
  }
}