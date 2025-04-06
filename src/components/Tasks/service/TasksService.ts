import { prisma } from '../../../libs/prisma';
import { CreateTaskInput, ShareTaskInput, UpdateTaskInput } from '../../../schemas/task.schema';
export class TaskService {
  async createTask(data: CreateTaskInput) {
    let task;
    try {
      task = await prisma.task.create({
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
    } catch (error) {
      throw new Error('Create_Task_Error');
    }
    return task;
  }

  async getAllTasks(userId: string) {
    let tasks;
    try {
      tasks = await prisma.task.findMany({
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
    } catch (error) {
      throw new Error('Get_All_Tasks_Error');
    }
    return tasks;
  }

  async getTaskById(id: string, userId: string) {
    let task;
    try {
      task = await prisma.task.findFirst({
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
    } catch (error) {
      throw new Error('Get_Task_Error');
    }
    if (!task) {
      throw new Error('Not_Found');
    }

    return task;
  }

  async checkTaskAccess(taskId: string, userId: string) {
    let taskUser;
    try {
      taskUser = await prisma.taskUser.findFirst({
        where: {
          taskId,
          userId
        }
      });
    } catch (error) {
      throw new Error('Error_Checking_Task_Access_Prisma');
    }
    return taskUser !== null; 
  }

  async updateTask(userId: string, data: UpdateTaskInput) {
    // Verifica se o usuário tem acesso à tarefa
    let hasAccess;
    try {
      hasAccess = await this.checkTaskAccess(data.id, userId);
    } catch (error) {
      throw error;
    }
    if (!hasAccess) {
      throw new Error('Access_Denied');
    }

    let task;
    try {
      task = await prisma.task.update({
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
    } catch (error) {
      throw new Error('Update_Task_Error');
    }
    return task;
  }

  async checkTaskPermission(taskId: string, userId: string) {
    let taskUser;
    try {
      taskUser = await prisma.taskUser.findFirst({
        where: {
          taskId,
        userId
      }
    });
    } catch (error) {
      throw new Error('Error_Checking_Task_Permission_Prisma');
    }
    return taskUser?.permission === 'OWNER';
  }

  async deleteTask(id: string) {
    let task; 
    try {
      task = await prisma.task.delete({
        where: { id },
        include: {
        taskUsers: true
      }
    });
    } catch (error) {
      throw new Error('Error_Deleting_Task_Prisma');
    }
    return task;
  }

  async shareTask(data: ShareTaskInput) {
    // Primeiro verifica se o usuário é o Owner
    let isOwner;
    try {
      isOwner = await this.checkTaskPermission(data.taskId, data.userId);
    } catch (error) {
      throw error;
    }
    if (!isOwner) {
      throw new Error('Unauthorized');
    }

    // Busca o usuário pelo email
    let targetUser;
    try {
      targetUser = await prisma.user.findUnique({
        where: { email: data.targetEmail }
      });
    } catch (error) {
      throw new Error('Error_Finding_User_Prisma');
    }

    if (!targetUser) {
      throw new Error('Not_Found');
    }

    // Verifica se o usuário alvo já está associado à task
    let existingShare;
    try {
      existingShare = await prisma.taskUser.findFirst({
        where: {
          taskId: data.taskId,
          userId: targetUser.id
        }
      });
    } catch (error) {
      throw new Error('Error_Finding_Task_User_Prisma');
    }

    if (existingShare) {
      throw new Error('Conflict');
    }

    // Compartilha a task com o usuário
    let taskUser;
    try {
      taskUser = await prisma.taskUser.create({
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
    } catch (error) {
      throw new Error('Error_Sharing_Task_Prisma');
    }
    return taskUser;
  }
} 