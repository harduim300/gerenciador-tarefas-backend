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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../service/AuthService");
const argon2 = __importStar(require("argon2"));
const jwt_1 = require("../../../libs/jwt");
const UsersService_1 = require("../../Users/service/UsersService");
const auth_signup_1 = require("../../../schemas/auth-signup");
const auth_signin_1 = require("../../../schemas/auth-signin");
class AuthController {
    constructor() {
        this.authService = new AuthService_1.AuthService();
        this.userService = new UsersService_1.UserService();
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = auth_signin_1.authSigninSchema.parse(req.body);
                const { email, password } = data;
                const user = yield this.authService.findByEmail(email);
                console.log(user);
                if (!user) {
                    res.status(401).json({ error: 'Email ou senha inválidos' });
                    return;
                }
                const validPassword = yield argon2.verify(user.password, password);
                if (!validPassword) {
                    res.status(401).json({ error: 'Email ou senha inválidos' });
                    return;
                }
                const token = (0, jwt_1.createJWT)(user.id);
                console.log(token);
                // Configurando o cookie para manter o usuario logado
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
                res.status(500).json({ error: 'Erro ao realizar login' });
                return;
            }
        });
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = auth_signup_1.authSignupSchema.parse(req.body);
                const { name, email, password } = data;
                const existingUser = yield this.authService.findByEmail(email);
                if (existingUser) {
                    res.status(409).json({ error: 'Email já cadastrado' });
                    return;
                }
                // Encriptando a senha
                const hashedPassword = yield argon2.hash(password, {
                    type: argon2.argon2id,
                    memoryCost: 2 ** 16,
                    timeCost: 3,
                    parallelism: 1
                });
                const user = yield this.userService.createUser({
                    name,
                    email,
                    password: hashedPassword
                });
                res.status(201).json({
                    user: user
                });
                return;
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Erro ao criar usuário' });
                return;
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
}
exports.AuthController = AuthController;
