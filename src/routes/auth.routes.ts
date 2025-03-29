import { Router } from 'express';
import { AuthController } from '../components/Auth/controller/AuthController';
import { verifyJWT } from '../libs/jwt';

const router = Router();
const authController = new AuthController();

router.post('/login', authController.signin.bind(authController));
router.post('/logout', verifyJWT, authController.logout.bind(authController));
router.post('/signup', authController.signup.bind(authController));
export default router;