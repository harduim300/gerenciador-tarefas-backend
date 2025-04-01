import usuariosRouter from "./users.routes";
import taskRouter from "./tasks.routes";
import { Router } from 'express';
import authRoutes from './auth.routes';
import { verifyJWT } from "../libs/jwt";


const router = Router();
router.use("/tasks", verifyJWT, taskRouter);
router.use("/usuario", verifyJWT, usuariosRouter)
router.use("/auth", authRoutes);

export default router;