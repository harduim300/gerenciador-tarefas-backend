"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const prisma_1 = require("../../../libs/prisma");
class TaskService {
    createTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.task.create({
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
        });
    }
    getAllTasks(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.task.findMany({
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
        });
    }
    getTaskById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield prisma_1.prisma.task.findFirst({
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
        });
    }
    checkTaskAccess(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskUser = yield prisma_1.prisma.taskUser.findFirst({
                where: {
                    taskId,
                    userId
                }
            });
            return taskUser !== null; // Retorna true se o usuário tem qualquer acesso à tarefa
        });
    }
    updateTask(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verifica se o usuário tem acesso à tarefa
            const hasAccess = yield this.checkTaskAccess(data.id, userId);
            if (!hasAccess) {
                throw new Error('Acesso negado a esta tarefa');
            }
            return prisma_1.prisma.task.update({
                where: { id: data.id },
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
        });
    }
    checkTaskPermission(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskUser = yield prisma_1.prisma.taskUser.findFirst({
                where: {
                    taskId,
                    userId
                }
            });
            return (taskUser === null || taskUser === void 0 ? void 0 : taskUser.permission) === 'OWNER';
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.task.delete({
                where: { id },
                include: {
                    taskUsers: true
                }
            });
        });
    }
    shareTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Primeiro verifica se o usuário é o Owner
            const isOwner = yield this.checkTaskPermission(data.taskId, data.userId);
            if (!isOwner) {
                throw new Error('Unauthorized');
            }
            // Busca o usuário pelo email
            const targetUser = yield prisma_1.prisma.user.findUnique({
                where: { email: data.targetEmail }
            });
            if (!targetUser) {
                throw new Error('Not_Found');
            }
            // Verifica se o usuário alvo já está associado à task
            const existingShare = yield prisma_1.prisma.taskUser.findFirst({
                where: {
                    taskId: data.taskId,
                    userId: targetUser.id
                }
            });
            if (existingShare) {
                throw new Error('Conflict');
            }
            // Compartilha a task com o usuário
            return prisma_1.prisma.taskUser.create({
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
        });
    }
}
exports.TaskService = TaskService;
