import { Router } from 'express';
import { AuthController } from '../components/Auth/controller/AuthController';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.signin.bind(authController));
router.post('/logout', authController.logout.bind(authController));

export default router;