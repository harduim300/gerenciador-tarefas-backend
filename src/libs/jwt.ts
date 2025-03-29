import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ExtendedRequest } from "../types/extended-request";

export const createJWT = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
}

export const verifyJWT = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['auth_token'] as string;
    if (!authHeader) {
        res.status(401).json({ error: "Acesso negado" });
        return;
    }
    const token = authHeader.split(' ')[1]; 
    jwt.verify(
        token, 
        process.env.JWT_SECRET as string,
        (err, decoded: any) => {
            if (err) {
                res.status(500).json({ error: "Acesso negado" });
                return;
            }
            req.userId = decoded.id;
            next();
        }
    );
}
