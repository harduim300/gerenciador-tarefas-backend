import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ExtendedRequest } from "../types/extended-request";
import JWT_SECRET from "../environment/jwt.env";

export const createJWT = (id: string) => {
    return jwt.sign({ id }, JWT_SECRET as string, { expiresIn: "7d" });
}

export const verifyJWT = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.cookies['authToken'];
    if (!authHeader) {
        res.status(401).json({ error: "Acesso negado" });
        return;
    }
    const token = authHeader
    jwt.verify(
        token, 
        JWT_SECRET as string,
        (err: any, decoded: any) => {
            if (err) {
                res.status(500).json({ error: "Erro ao verificar o token" });
                return;
            }
            req.userId = decoded.id;
            next();
        }
    );
}
