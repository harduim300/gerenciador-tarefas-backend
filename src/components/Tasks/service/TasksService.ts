import { prisma } from '../../../libs/prisma';
import { CreateTaskInput, ShareTaskInput, UpdateTaskInput } from '../../../schemas/task.schema';
export class TaskService {
  async createTask(data: CreateTaskInput) {
    
    return prisma.task.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        status: data.status || 'NOT_STARTED',
        taskUsers: {
          create: {
            permission: 'OWNER',
            user: {
              connect: {
                id: data.userId
              }
            }
          }
        }
      },
      include: {
        taskUsers: {
          include: {
            user: true
          }
        }
      }
    });
  }

  async getAllTasks(userId: string) {
    return prisma.task.findMany({
      where: {
        taskUsers: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        taskUsers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            taskUsers: true
          }
        }
      }
    });
  }

  async getTaskById(id: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id,
        taskUsers: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        taskUsers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        _count: {
          select: {
            taskUsers: true
          }
        }
      }
    });

    if (!task) {
      throw new Error('Tarefa não encontrada ou acesso negado');
    }

    return task;
  }

  async checkTaskAccess(taskId: string, userId: string) {
    const taskUser = await prisma.taskUser.findFirst({
      where: {
        taskId,
        userId
      }
    });

    return taskUser !== null; // Retorna true se o usuário tem qualquer acesso à tarefa
  }

  async updateTask(userId: string, data: UpdateTaskInput) {
    // Verifica se o usuário tem acesso à tarefa
    const hasAccess = await this.checkTaskAccess(data.id, userId);
    if (!hasAccess) {
      throw new Error('Acesso negado a esta tarefa');
    }

    return prisma.task.update({
      where: { id: data.id  },
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        status: data.status
      },
      include: {
        taskUsers: {
          include: {
            user: true
          }
        },
        _count: {
          select: {
            taskUsers: true
          }
        }
      }
    });
  }

  async checkTaskPermission(taskId: string, userId: string) {
    const taskUser = await prisma.taskUser.findFirst({
      where: {
        taskId,
        userId
      }
    });

    return taskUser?.permission === 'OWNER';
  }

  async deleteTask(id: string) {

    return prisma.task.delete({
      where: { id },
      include: {
        taskUsers: true
      }
    });
  }

  async shareTask(data: ShareTaskInput) {
    // Primeiro verifica se o usuário é o Owner
    const isOwner = await this.checkTaskPermission(data.taskId, data.userId);
    if (!isOwner) {
      throw new Error('Unauthorized');
    }

    // Busca o usuário pelo email
    const targetUser = await prisma.user.findUnique({
      where: { email: data.targetEmail }
    });

    if (!targetUser) {
      throw new Error('Not_Found');
    }

    // Verifica se o usuário alvo já está associado à task
    const existingShare = await prisma.taskUser.findFirst({
      where: {
        taskId: data.taskId,
        userId: targetUser.id
      }
    });

    if (existingShare) {
      throw new Error('Conflict');
    }

    // Compartilha a task com o usuário
    return prisma.taskUser.create({
      data: {
        permission: 'USER',
        task: {
          connect: {
            id: data.taskId
          }
        },
        user: {
          connect: {
            id: targetUser.id
          }
        }
      },
      include: {
        task: true,
        user: true
      }
    });
  }
} 