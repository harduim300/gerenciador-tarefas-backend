import { Request, Response } from 'express';
import { UserService } from '../service/UsersService';
import * as argon2 from 'argon2';
import { ExtendedRequest } from '../../../types/extended-request';

// Coloquei comentarios falando sobre metodos que modificaria na aplicacao real

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async createUser(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
        res.status(401).json({ error: 'Acesso negado' });
        return;
    }
    try {
      const { password, ...userData } = req.body;
      const hashedPassword = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16,
        timeCost: 3,
        parallelism: 1
      });

      const user = await this.userService.createUser({
        ...userData,
        password: hashedPassword
      });
      
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
      return;
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar usuário' });
      return;
    }
  }

  async getAllUsers(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
        res.status(401).json({ error: 'Acesso negado' });
        return;
    }
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
      return;
    } catch (error) {
      res.status(400).json({ error: 'Erro ao buscar usuários' });
      return;
    }
  }

  async getUserById(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
        res.status(401).json({ error: 'Acesso negado' });
        return;
    }
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
      return;
    } catch (error) {
      res.status(400).json({ error: 'Erro ao buscar usuário' });
      return;
    }
  }
  // Colocado porque foi pedido no desafio
  // Seria melhor um OTP para atualizacao de senha, logo modificaria o metodo
  // para receber o email e o OTP
  async updateUser(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
        res.status(401).json({ error: 'Acesso negado' });
        return;
    }
    try {
      const { password, ...updateData } = req.body;
      let dataToUpdate = updateData;

      if (password) {
        const hashedPassword = await argon2.hash(password, {
          type: argon2.argon2id,
          memoryCost: 2 ** 16,
          timeCost: 3,
          parallelism: 1
        });
        dataToUpdate = { ...updateData, password: hashedPassword };
      }

      const user = await this.userService.updateUser(req.params.id, dataToUpdate);
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
      return;
    } catch (error) {
      res.status(400).json({ error: 'Erro ao atualizar usuário' });
      return;
    }
  }

  // Colocado porque foi pedido no desafio
  // Acredito que nao seria necessario para um caso real, pois permitiria
  // Usuario sem permissao deletar outro usuario, tentaria fazer uma separacao de niveis
  // maior ou separar do sistema. Para o usuario apagar a conta faria por email com OTP
  async deleteUser(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
        res.status(401).json({ error: 'Acesso negado' });
        return;
    }
    try {
      const user = await this.userService.deleteUser(req.params.id);
      if (!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      }
      res.status(204).send();
      return;
    } catch (error) {
      res.status(400).json({ error: 'Erro ao deletar usuário' });
      return;
    }
  }
}