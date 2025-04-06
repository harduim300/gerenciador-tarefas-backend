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
      res.status(401).json({ error: 'Access_Denied' });
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
        res.status(201).json(task);
        return;
    } catch (error: any) {
        res.status(400).json({ error: error.message });
        return;
    }
  }

  // -----------------------------------------

  async getAllTasks(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: 'Access_Denied' });
      return;
    }
    try {
      const tasks = await this.taskService.getAllTasks(req.userId);
      res.status(200).json(tasks);
      return;
    } catch (error: any) {
      res.status(400).json({ error: error.message });
      return;
    }
  }

  // -----------------------------------------

  async getTaskById(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: 'Access_Denied' });
      return;
    }
    try {
      const task = await this.taskService.getTaskById(req.params.id, req.userId);
      res.status(200).json(task);
      return;
    } catch (error: any) {
      if (error.message === 'Not_Found') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: error.message });
      return;
    }
  }

  // -----------------------------------------

  async updateTask(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: 'Access_Denied' });
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
      if (error.message === 'Access_Denied') {
        res.status(403).json({ error: error.message });
        return;
      }
      res.status(400).json({ error: error.message });
      return;
    }
  }

  // -----------------------------------------

  async deleteTask(req: ExtendedRequest, res: Response) {

    if (!req.userId) {
      res.status(401).json({ error: 'Access_Denied' });
      return;
    }

    try {

      const isOwner = await this.taskService.checkTaskPermission(req.params.id, req.userId);
      if (!isOwner) {
        res.status(403).json({ error: 'Access_Denied' });
        return;
      }
      const task = await this.taskService.deleteTask(req.params.id);
      if (!task) {
        res.status(404).json({ error: 'Task_Not_Found' });
        return;
      }
      res.status(204).send();
      return;

    } catch (error: any) {

      if (error.message === 'Error_Checking_Task_Permission_Prisma') {
        res.status(403).json({ error: 'Access_Denied' });
        return;
      } else if (error.message === 'Error_Deleting_Task_Prisma') {
        res.status(404).json({ error: 'Error_On_Deleting_Task' });
        return;
      }
      res.status(400).json({ error: error.message });
      return;

    }

  }

  // -----------------------------------------

  async shareTask(req: ExtendedRequest, res: Response) {
    if (!req.userId) {
      res.status(401).json({ error: 'Access_Denied' });
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
      res.status(200).json(task);
      return;
    } catch (error: any) {

      console.log("Erro ao compartilhar tarefa", error);
      if (error.message === 'Unauthorized') {
        res.status(403).json({ error: 'Access_Denied' });
        return;
      } else if (error.message === 'Not_Found') {
        res.status(404).json({ error: 'User_Not_Found' });
        return;
      } else if (error.message === 'Conflict') {
        res.status(409).json({ error: 'User_Already_Associated_With_Task' });
        return;
      }
      res.status(400).json({ error: error.message });
      return;
    }
  }
} 