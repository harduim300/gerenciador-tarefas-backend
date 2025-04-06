import taskRouter from "./tasks.routes";
import { Router } from 'express';
import authRoutes from './auth.routes';
import { verifyJWT } from "../libs/jwt";


const router = Router();
router.use("/tasks", verifyJWT, taskRouter);
router.use("/auth", authRoutes);

export default router;