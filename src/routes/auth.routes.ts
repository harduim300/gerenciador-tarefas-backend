import { Router } from 'express';
import cors from 'cors';
import { AuthController } from '../components/Auth/controller/AuthController';
import { verifyJWT } from '../libs/jwt';

const router = Router();
const authController = new AuthController();

// 🔹 CORS para rotas públicas (login e signup)
const publicCors = cors({
    origin: 'https://gerenciador-tarefas-frontend-one.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
});

// 🔹 CORS para rotas privadas (logout, que exige autenticação)
const privateCors = cors({
    origin: 'https://gerenciador-tarefas-frontend-one.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

// 🔹 Rotas públicas
router.post('/login', publicCors, authController.signin.bind(authController));
router.post('/signup', publicCors, authController.signup.bind(authController));

// 🔹 Rota privada (precisa de token para deslogar)
router.post('/logout', privateCors, verifyJWT, authController.logout.bind(authController));

export default router;
