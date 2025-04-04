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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("./jwt");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_env_1 = __importDefault(require("../environment/jwt.env"));
describe("JWT Tests", () => {
    // cria um request, response e next
    let req;
    let res;
    let next;
    beforeEach(() => {
        // cria um request, response e next
        // req é um request com cookies vazios
        // res é um response com status e json
        // next é uma funcao que nao faz nada
        req = { cookies: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });
    afterEach(() => {
        // limpa os mocks de req, res e next
        jest.clearAllMocks();
    });
    // cria um userId
    const userId = (0, uuid_1.v4)();
    it("should create a JWT", () => {
        // aplica a funcao createJWT com o userId
        const token = (0, jwt_1.createJWT)(userId);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
        // Verifica se o token pode ser decodificado
        const decoded = jsonwebtoken_1.default.verify(token, jwt_env_1.default);
        expect(decoded.id).toBe(userId);
        expect(decoded.iat).toBeDefined();
        expect(decoded.exp).toBeDefined();
        // Verifica se o token expira em 7 dias
        const sevenDaysInSeconds = 7 * 24 * 60 * 60;
        const expirationTime = decoded.exp - decoded.iat;
        expect(expirationTime).toBe(sevenDaysInSeconds);
    });
    it("should verify a valid JWT", () => __awaiter(void 0, void 0, void 0, function* () {
        // cria um token com o userId
        const token = (0, jwt_1.createJWT)(userId);
        req.cookies = { authToken: token };
        // chama a funcao verifyJWT com o req, res e next
        yield (0, jwt_1.verifyJWT)(req, res, next);
        // verifica se a funcao next foi chamada com o userId sem erro na resposta
        expect(req.userId).toBe(userId);
        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    }));
    it("should reject when no token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        // chama a funcao verifyJWT com o req, res e next
        // sem token
        yield (0, jwt_1.verifyJWT)(req, res, next);
        // verifica se req.userId é undefined, o res.status foi chamado com 401, e a resposta é { error: "Acesso negado" }
        expect(req.userId).toBeUndefined();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Acesso negado" });
        expect(next).not.toHaveBeenCalled();
    }));
    it("should reject when token is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        // cria um token invalido
        req.cookies = { authToken: "invalid-token" };
        // chama a funcao verifyJWT com o req, res e next
        yield (0, jwt_1.verifyJWT)(req, res, next);
        // verifica se req.userId é undefined, o res.status foi chamado com 500, e a resposta é { error: "Erro ao verificar o token" }
        expect(req.userId).toBeUndefined();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Erro ao verificar o token" });
        expect(next).not.toHaveBeenCalled();
    }));
});
