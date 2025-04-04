import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';
import { ExtendedRequest } from '../../../types/extended-request';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token } = await this.authService.signin(email, password);

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em milissegundos
      });

      res.status(200).json({ message: 'Login realizado com sucesso' });
      return
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ error: error.message });
        return
      } else {
        res.status(500).json({ error: 'Erro ao realizar login' });
        return
      }
    }
  }

  async signup(req: Request, res: Response) {
    try {
      await this.authService.signup(req.body);
      res.status(201).json({ message: 'Usuário criado com sucesso' });
      return
    } catch (error) {
      if (error instanceof Error) {
        res.status(409).json({ error: error.message });
        return
      } else {
        res.status(500).json({ error: 'Erro ao criar usuário' });
        return
      }
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
      return
    } catch (error) {
      res.status(500).json({ error: 'Erro ao realizar logout' });
      return
    }
  }

  async verify(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: 'Acesso Negado' });
      return;
    }

    try {
      await this.authService.verify(req.userId);
      res.status(200).json({ message: 'Acesso Autorizado' });
      return
    } catch (error) {
      res.status(401).json({ error: 'Acesso Negado' });
      return
    }
  }
}