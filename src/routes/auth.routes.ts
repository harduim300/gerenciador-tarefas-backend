import { Router } from 'express';
import cors from 'cors';
import { AuthController } from '../components/Auth/controller/AuthController';
import { verifyJWT } from '../libs/jwt';

const router = Router();
const authController = new AuthController();

// 🔹 Rotas públicas
router.post('/login', authController.signin.bind(authController));
router.post('/signup', authController.signup.bind(authController));

// 🔹 Rota privada (precisa de token para deslogar)
router.post('/logout', verifyJWT, authController.logout.bind(authController));

export default router;
