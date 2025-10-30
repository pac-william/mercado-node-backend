import { Router } from 'express';
import { userController } from '../controllers/userController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

// Rotas públicas
router.post('/', userController.createUser);
router.get('/', userController.getUsers);

// Privadas
router.get('/:id', validateToken, userController.getUserById);
router.get('/auth0/:auth0Id', validateToken, userController.getUserByAuth0Id);
router.put('/:id', validateToken, userController.updateUser);
router.patch('/:id', validateToken, userController.updateUserPartial);
router.delete('/:id', validateToken, userController.deleteUser);

export default router;
