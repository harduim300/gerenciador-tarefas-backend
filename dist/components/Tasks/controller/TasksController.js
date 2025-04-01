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
exports.TaskController = void 0;
const TasksService_1 = require("../service/TasksService");
const task_schema_1 = require("../../../schemas/task.schema");
class TaskController {
    constructor() {
        this.taskService = new TasksService_1.TaskService();
    }
    createTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso negado' });
                return;
            }
            const { data, error } = task_schema_1.TaskSchema.safeParse(req.body);
            if (error) {
                res.status(400).json({ error: error.message });
                return;
            }
            try {
                const task = yield this.taskService.createTask(Object.assign(Object.assign({}, data), { userId: req.userId }));
                console.log("Tarefa criada com sucesso", task);
                res.status(201).json(task);
                return;
            }
            catch (error) {
                console.log("Erro ao criar tarefa", error);
                res.status(400).json({ error: 'Erro ao criar tarefa' });
                return;
            }
        });
    }
    getAllTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso negado' });
                return;
            }
            try {
                const tasks = yield this.taskService.getAllTasks(req.userId);
                res.status(200).json(tasks);
                return;
            }
            catch (error) {
                res.status(400).json({ error: 'Erro ao buscar tarefas' });
                return;
            }
        });
    }
    getTaskById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso negado' });
                return;
            }
            try {
                const task = yield this.taskService.getTaskById(req.params.id, req.userId);
                res.status(200).json(task);
                return;
            }
            catch (error) {
                if (error.message === 'Tarefa não encontrada ou acesso negado') {
                    res.status(404).json({ error: error.message });
                    return;
                }
                res.status(400).json({ error: 'Erro ao buscar tarefa' });
                return;
            }
        });
    }
    updateTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso negado' });
                return;
            }
            const data_req = Object.assign(Object.assign({}, req.body), { id: req.params.id });
            const { data, error } = task_schema_1.UpdateTaskSchema.safeParse(data_req);
            if (error) {
                res.status(400).json({ error: error.message });
                return;
            }
            try {
                const task = yield this.taskService.updateTask(req.userId, data);
                res.status(200).json(task);
                return;
            }
            catch (error) {
                if (error.message === 'Acesso negado a esta tarefa') {
                    res.status(403).json({ error: error.message });
                    return;
                }
                res.status(400).json({ error: 'Erro ao atualizar tarefa' });
                return;
            }
        });
    }
    deleteTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso negado' });
                return;
            }
            try {
                const isOwner = yield this.taskService.checkTaskPermission(req.params.id, req.userId);
                if (!isOwner) {
                    res.status(403).json({ error: 'Apenas o proprietário pode deletar a tarefa' });
                    return;
                }
                const task = yield this.taskService.deleteTask(req.params.id);
                if (!task) {
                    res.status(404).json({ error: 'Tarefa não encontrada' });
                    return;
                }
                res.status(204).send();
                return;
            }
            catch (error) {
                res.status(400).json({ error: 'Erro ao deletar tarefa' });
                return;
            }
        });
    }
    shareTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso negado' });
                return;
            }
            try {
                const data_req = {
                    taskId: req.params.id,
                    userId: req.userId,
                    targetEmail: req.body.email,
                };
                const { data, error } = task_schema_1.ShareTaskSchema.safeParse(data_req);
                if (error) {
                    res.status(400).json({ error: error.message });
                    return;
                }
                const task = yield this.taskService.shareTask(data);
                console.log("Tarefa compartilhada com sucesso", task);
                res.status(200).json(task);
                return;
            }
            catch (error) {
                console.log("Erro ao compartilhar tarefa", error);
                if (error.message === 'Unauthorized') {
                    res.status(403).json({ error: 'Acesso negado a esta tarefa' });
                    return;
                }
                else if (error.message === 'Not_Found') {
                    res.status(404).json({ error: 'Usuário não encontrado' });
                    return;
                }
                else if (error.message === 'Conflict') {
                    res.status(409).json({ error: 'Usuário já está associado a esta tarefa' });
                    return;
                }
                res.status(400).json({ error: error.message });
                return;
            }
        });
    }
}
exports.TaskController = TaskController;
