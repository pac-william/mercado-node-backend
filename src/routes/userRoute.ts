import { Router } from 'express';
import { userController } from '../controllers/userController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

// Rotas públicas
router.post('/', userController.createUser);

// Privadas
router.get('/', validateToken, userController.getUsers);
router.get('/:id', validateToken, userController.getUserById);
router.put('/:id', validateToken, userController.updateUser);
router.patch('/:id', validateToken, userController.updateUserPartial);
router.delete('/:id', validateToken, userController.deleteUser);

export default router;
