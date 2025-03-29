import {  Response } from 'express';
import { TaskService } from '../service/TasksService';
import { ExtendedRequest } from '../../../types/extended-request';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  async createTask (req: ExtendedRequest, res: Response) {
    try {
        const task = await this.taskService.createTask(req.body);
        console.log("Tarefa criada com sucesso", task);
        res.status(201).json(task);
        return;
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar tarefa' });
        return;
    }
  }

  async getAllTasks(req: ExtendedRequest, res: Response) {
    try {
      const tasks = await this.taskService.getAllTasks();
      console.log(tasks);
      res.status(200).json(tasks);
      return; 
    } catch (error) {
        res.status(400).json({ error: 'Erro ao buscar tarefas' });
      return;
    }
  }

  async getTaskById(req: ExtendedRequest, res: Response) {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      if (!task) {
        res.status(404).json({ error: 'Tarefa não encontrada' });
        return 
      }
        res.status(200).json(task);
        return 
    } catch (error) {
        res.status(400).json({ error: 'Erro ao buscar tarefa' });
        return 
    }
  }

  async updateTask(req: ExtendedRequest, res: Response) {
    try {
        const task = await this.taskService.updateTask(req.params.id, req.body);
        if (!task) {
            res.status(404).json({ error: 'Tarefa não encontrada' });
            return 
        }
        console.log("Tarefa atualizada com sucesso", task);
        res.status(200).json(task);
        return 
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar tarefa' });
        return 
    }
  }

  async deleteTask(req: ExtendedRequest, res: Response) {
    try {
      const task = await this.taskService.deleteTask(req.params.id);
      if (!task) {
        res.status(404).json({ error: 'Tarefa não encontrada' });
        return 
      }
      console.log("Tarefa deletada com sucesso", task);
        res.status(204).send();
        return 
    } catch (error) {
        res.status(400).json({ error: 'Erro ao deletar tarefa' });
      return 
    }
  }
} 