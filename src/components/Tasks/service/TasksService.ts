import { prisma } from '../../../libs/prisma';

export class TaskService {
  async createTask(data: { title: string; description?: string; status?: string }) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || 'PENDING',
      },
    });
  }

  async getAllTasks() {
    return prisma.task.findMany();
  }

  async getTaskById(id: string) {
    return prisma.task.findUnique({
      where: { id },
    });
  }

  async updateTask(id: string, data: { title?: string; description?: string; status?: string }) {
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  async deleteTask(id: string) {
    return prisma.task.delete({
      where: { id },
    });
  }
} 