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
exports.AuthController = void 0;
const AuthService_1 = require("../service/AuthService");
class AuthController {
    constructor() {
        this.authService = new AuthService_1.AuthService();
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { token } = yield this.authService.signin(email, password);
                res.cookie('authToken', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em milissegundos
                });
                res.status(200).json({ message: 'Login realizado com sucesso' });
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(401).json({ error: error.message });
                    return;
                }
                else {
                    res.status(500).json({ error: 'Erro ao realizar login' });
                    return;
                }
            }
        });
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authService.signup(req.body);
                res.status(201).json({ message: 'Usuário criado com sucesso' });
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(409).json({ error: error.message });
                    return;
                }
                else {
                    res.status(500).json({ error: 'Erro ao criar usuário' });
                    return;
                }
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso negado' });
                return;
            }
            try {
                res.clearCookie('authToken', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
                res.status(200).json({ message: 'Logout realizado com sucesso' });
                return;
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao realizar logout' });
                return;
            }
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.userId) {
                res.status(401).json({ error: 'Acesso Negado' });
                return;
            }
            try {
                yield this.authService.verify(req.userId);
                res.status(200).json({ message: 'Acesso Autorizado' });
                return;
            }
            catch (error) {
                res.status(401).json({ error: 'Acesso Negado' });
                return;
            }
        });
    }
}
exports.AuthController = AuthController;
