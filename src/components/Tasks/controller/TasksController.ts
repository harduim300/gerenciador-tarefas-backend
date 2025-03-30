import {  Response } from 'express';
import { TaskService } from '../service/TasksService';
import { ExtendedRequest } from '../../../types/extended-request';
import { ShareTaskSchema, TaskSchema, UpdateTaskSchema } from '../../../schemas/task.schema';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  async createTask (req: ExtendedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: 'Acesso negado' });
      return;
    }
    const { data, error } = TaskSchema.safeParse(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    try {
        const task = await this.taskService.createTask({
          ...data,
          userId: req.userId
        });
        console.log("Tarefa criada com sucesso", task);
        res.status(201).json(task);
        return;
    } catch (error) {
        console.log("Erro ao criar tarefa", error);
        res.status(400).json({ error: 'Erro ao criar tarefa' });
        return;
    }
  }

  async getAllTasks(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: 'Acesso negado' });
      return;
    }
    try {
      const tasks = await this.taskService.getAllTasks(req.userId);
      res.status(200).json(tasks);
      return;
    } catch (error) {
      res.status(400).json({ error: 'Erro ao buscar tarefas' });
      return;
    }
  }

  async getTaskById(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: 'Acesso negado' });
      return;
    }
    try {
      const task = await this.taskService.getTaskById(req.params.id, req.userId);
      res.status(200).json(task);
      return;
    } catch (error: any) {
      if (error.message === 'Tarefa não encontrada ou acesso negado') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: 'Erro ao buscar tarefa' });
      return;
    }
  }

  async updateTask(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: 'Acesso negado' });
      return;
    }

    const data_req = {
      ...req.body,
      id: req.params.id
    }

    const { data, error } = UpdateTaskSchema.safeParse(data_req);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }

    try {
      const task = await this.taskService.updateTask(req.userId, data);
      res.status(200).json(task);
      return;
    } catch (error: any) {
      if (error.message === 'Acesso negado a esta tarefa') {
        res.status(403).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: 'Erro ao atualizar tarefa' });
      return;
    }
  }

  async deleteTask(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: 'Acesso negado' });
      return;
    }

    try {
      const isOwner = await this.taskService.checkTaskPermission(req.params.id, req.userId);
      
      if (!isOwner) {
        res.status(403).json({ error: 'Apenas o proprietário pode deletar a tarefa' });
        return;
      }

      const task = await this.taskService.deleteTask(req.params.id);
      if (!task) {
        res.status(404).json({ error: 'Tarefa não encontrada' });
        return;
      }
      res.status(204).send();
      return;
    } catch (error) {
      res.status(400).json({ error: 'Erro ao deletar tarefa' });
      return;
    }
  }

  async shareTask(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: 'Acesso negado' });
      return;
    }

    try {

      const data_req = {
        taskId: req.params.id,
        userId: req.userId,
        targetEmail: req.body.email,
      }

      const { data, error } = ShareTaskSchema.safeParse(data_req);

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      const task = await this.taskService.shareTask(data);
      console.log("Tarefa compartilhada com sucesso", task);
      res.status(200).json(task);
      return;
    } catch (error: any) {
      console.log("Erro ao compartilhar tarefa", error);
      if (error.message === 'Unauthorized') {
        res.status(403).json({ error: 'Acesso negado a esta tarefa' });
        return;
      } else if (error.message === 'Not_Found') {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
      } else if (error.message === 'Conflict') {
        res.status(409).json({ error: 'Usuário já está associado a esta tarefa' });
        return;
      }
      res.status(400).json({ error: error.message });
      return;
    }
  }
} 