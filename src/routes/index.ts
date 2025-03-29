import usuariosRouter from "./users.routes";
import taskRouter from "./tasks.routes";
import { Router } from 'express';
import taskRoutes from './tasks.routes';
import authRoutes from './auth.routes';
import { verifyJWT } from "../libs/jwt";

const router = Router();
router.use("/tasks", verifyJWT, taskRouter);
router.use("/usuario", verifyJWT, usuariosRouter)
router.use("/auth", authRoutes);
router.use(taskRoutes);

router.get('/', (req,res) => {
    res.json({"reponse": "Boas vindas ao server express"})
});

router.get('/rota-dinamica/:from/:to', (req, res) => {
    const {from, to} = req.params
    res.json({
        response: "Voce fez um voo", 
        From: from.toUpperCase(), 
        To: to.toUpperCase()})
});

export default router;