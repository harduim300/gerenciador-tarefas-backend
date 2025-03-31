import usuariosRouter from "./users.routes";
import taskRouter from "./tasks.routes";
import { Router } from 'express';
import authRoutes from './auth.routes';
import { verifyJWT } from "../libs/jwt";
import cors from 'cors';

const privateCors = cors({
    origin: 'https://gerenciador-tarefas-frontend-one.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

const router = Router();
router.use("/tasks", privateCors, verifyJWT, taskRouter);
router.use("/usuario", privateCors, verifyJWT, usuariosRouter)
router.use("/auth", authRoutes);


export default router;