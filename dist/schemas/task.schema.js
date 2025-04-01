"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareTaskSchema = exports.UpdateTaskSchema = exports.CreateTaskInput = exports.TaskSchema = exports.TaskStatus = void 0;
const zod_1 = require("zod");
// Enum para status
exports.TaskStatus = zod_1.z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']);
// Schema base para Task
exports.TaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Título é obrigatório'),
    category: zod_1.z.string().min(1, 'Categoria é obrigatória'),
    description: zod_1.z.string().optional(),
    status: exports.TaskStatus, // Agora é obrigatório e só aceita os valores do enum
});
// Schema para criação de Task (inclui todos os campos necessários)
exports.CreateTaskInput = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Título é obrigatório'),
    category: zod_1.z.string().min(1, 'Categoria é obrigatória'),
    description: zod_1.z.string().optional(),
    status: exports.TaskStatus,
    userId: zod_1.z.string().uuid('ID de usuário inválido')
});
// Schema para atualização de Task
exports.UpdateTaskSchema = exports.TaskSchema.partial().extend({
    id: zod_1.z.string().uuid('ID de tarefa inválido')
});
// Schema para compartilhamento
exports.ShareTaskSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid('ID de tarefa inválido'),
    userId: zod_1.z.string().uuid('ID de usuário inválido'),
    targetEmail: zod_1.z.string().email('Email inválido')
});
