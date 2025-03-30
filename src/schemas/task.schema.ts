import { z } from 'zod';

// Enum para status
export const TaskStatus = z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']);

// Schema base para Task
export const TaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().optional(),
  status: TaskStatus, // Agora é obrigatório e só aceita os valores do enum
});

// Schema para criação de Task (inclui todos os campos necessários)
export const CreateTaskInput = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().optional(),
  status: TaskStatus,
  userId: z.string().uuid('ID de usuário inválido')
});

// Schema para atualização de Task
export const UpdateTaskSchema = TaskSchema.partial().extend({
    id: z.string().uuid('ID de tarefa inválido')
});

// Schema para compartilhamento
export const ShareTaskSchema = z.object({
  taskId: z.string().uuid('ID de tarefa inválido'),
  userId: z.string().uuid('ID de usuário inválido'),
  targetEmail: z.string().email('Email inválido')
});

// Tipos inferidos dos schemas
export type CreateTaskInput = z.infer<typeof CreateTaskInput>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type ShareTaskInput = z.infer<typeof ShareTaskSchema>; 
export type TaskSchemaType = z.infer<typeof TaskSchema>;