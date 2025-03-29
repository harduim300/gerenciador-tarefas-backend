import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { ExtendedRequest } from "../types/extended-request";

export const createJWT = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
}

export const verifyJWT = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    console.log(req.headers)
    const authHeader = req.cookies['auth_token'];
    console.log(authHeader);
    if (!authHeader) {
        res.status(401).json({ error: "Acesso negado" });
        return;
    }
    const token = authHeader
    jwt.verify(
        token, 
        process.env.JWT_SECRET as string,
        (err: any, decoded: any) => {
            if (err) {
                res.status(500).json({ error: "Acesso negado" });
                return;
            }
            req.userId = decoded.id;
            next();
        }
    );
}
