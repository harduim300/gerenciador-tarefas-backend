import { Router } from 'express';
import { UserController } from '../components/Users/controller/UsersController';

const router = Router();
const userController = new UserController();

router.post('/users', userController.createUser.bind(userController));
router.get('/users', userController.getAllUsers.bind(userController));
router.get('/users/:id', userController.getUserById.bind(userController));
router.put('/users/:id', userController.updateUser.bind(userController));
router.delete('/users/:id', userController.deleteUser.bind(userController));

export default router;