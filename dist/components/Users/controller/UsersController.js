"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UsersService_1 = require("../service/UsersService");
const argon2 = __importStar(require("argon2"));
// Coloquei comentarios falando sobre metodos que modificaria na aplicacao real
class UserController {
    constructor() {
        this.userService = new UsersService_1.UserService();
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso negado' });
                return;
            }
            try {
                const _a = req.body, { password } = _a, userData = __rest(_a, ["password"]);
                const hashedPassword = yield argon2.hash(password, {
                    type: argon2.argon2id,
                    memoryCost: 2 ** 16,
                    timeCost: 3,
                    parallelism: 1
                });
                const user = yield this.userService.createUser(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                res.status(201).json(userWithoutPassword);
                return;
            }
            catch (error) {
                res.status(400).json({ error: 'Erro ao criar usuário' });
                return;
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso negado' });
                return;
            }
            try {
                const users = yield this.userService.getAllUsers();
                res.status(200).json(users);
                return;
            }
            catch (error) {
                res.status(400).json({ error: 'Erro ao buscar usuários' });
                return;
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso negado' });
                return;
            }
            try {
                const user = yield this.userService.getUserById(req.params.id);
                if (!user) {
                    res.status(404).json({ error: 'Usuário não encontrado' });
                    return;
                }
                const { password } = user, userWithoutPassword = __rest(user, ["password"]);
                res.status(200).json(userWithoutPassword);
                return;
            }
            catch (error) {
                res.status(400).json({ error: 'Erro ao buscar usuário' });
                return;
            }
        });
    }
    // Colocado porque foi pedido no desafio
    // Seria melhor um OTP para atualizacao de senha, logo modificaria o metodo
    // para receber o email e o OTP
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso negado' });
                return;
            }
            try {
                const _a = req.body, { password } = _a, updateData = __rest(_a, ["password"]);
                let dataToUpdate = updateData;
                if (password) {
                    const hashedPassword = yield argon2.hash(password, {
                        type: argon2.argon2id,
                        memoryCost: 2 ** 16,
                        timeCost: 3,
                        parallelism: 1
                    });
                    dataToUpdate = Object.assign(Object.assign({}, updateData), { password: hashedPassword });
                }
                const user = yield this.userService.updateUser(req.params.id, dataToUpdate);
                if (!user) {
                    res.status(404).json({ error: 'Usuário não encontrado' });
                    return;
                }
                const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
                res.status(200).json(userWithoutPassword);
                return;
            }
            catch (error) {
                res.status(400).json({ error: 'Erro ao atualizar usuário' });
                return;
            }
        });
    }
    // Colocado porque foi pedido no desafio
    // Acredito que nao seria necessario para um caso real, pois permitiria
    // Usuario sem permissao deletar outro usuario, tentaria fazer uma separacao de niveis
    // maior ou separar do sistema. Para o usuario apagar a conta faria por email com OTP
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso negado' });
                return;
            }
            try {
                const user = yield this.userService.deleteUser(req.params.id);
                if (!user) {
                    res.status(404).json({ error: 'Usuário não encontrado' });
                    return;
                }
                res.status(204).send();
                return;
            }
            catch (error) {
                res.status(400).json({ error: 'Erro ao deletar usuário' });
                return;
            }
        });
    }
}
exports.UserController = UserController;
