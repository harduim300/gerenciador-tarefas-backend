import { ExtendedRequest } from "../types/extended-request";
import { createJWT, verifyJWT } from "./jwt";
import { v4 as uuidv4 } from "uuid";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import JWT_SECRET from "../environment/jwt.env";

describe("JWT Tests", () => {
    // cria um request, response e next
    let req: Partial<ExtendedRequest>;
    let res: Partial<Response>;
    let next: NextFunction;
    
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
    const userId = uuidv4();

    it("should create a JWT", () => {

        // aplica a funcao createJWT com o userId
        const token = createJWT(userId);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
        
        // Verifica se o token pode ser decodificado
        const decoded = jwt.verify(token, JWT_SECRET as string) as { id: string; iat: number; exp: number };
        expect(decoded.id).toBe(userId);
        expect(decoded.iat).toBeDefined();
        expect(decoded.exp).toBeDefined();
        
        // Verifica se o token expira em 7 dias
        const sevenDaysInSeconds = 7 * 24 * 60 * 60;
        const expirationTime = decoded.exp - decoded.iat;
        expect(expirationTime).toBe(sevenDaysInSeconds);
    });

    it("should verify a valid JWT", async () => {
        // cria um token com o userId
        const token = createJWT(userId);
        req.cookies = { authToken: token };
        // chama a funcao verifyJWT com o req, res e next
        await verifyJWT(req as ExtendedRequest, res as Response, next as NextFunction);
        // verifica se a funcao next foi chamada com o userId sem erro na resposta
        expect(req.userId).toBe(userId);
        expect(res.status).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
    });

    it("should reject when no token is provided", async () => {
        // chama a funcao verifyJWT com o req, res e next
        // sem token
        await verifyJWT(req as ExtendedRequest, res as Response, next as NextFunction);
        
        // verifica se req.userId é undefined, o res.status foi chamado com 401, e a resposta é { error: "Acesso negado" }
        expect(req.userId).toBeUndefined();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Acesso negado" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should reject when token is invalid", async () => {
        // cria um token invalido
        req.cookies = { authToken: "invalid-token" };
        // chama a funcao verifyJWT com o req, res e next
        await verifyJWT(req as ExtendedRequest, res as Response, next as NextFunction);
        
        // verifica se req.userId é undefined, o res.status foi chamado com 500, e a resposta é { error: "Erro ao verificar o token" }
        expect(req.userId).toBeUndefined();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Erro ao verificar o token" });
        expect(next).not.toHaveBeenCalled();
    });
});
