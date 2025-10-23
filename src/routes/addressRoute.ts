import { Router } from 'express';
import { addressController } from '../controllers/addressController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Todas as rotas de endereço requerem autenticação
router.get('/', authenticate, addressController.getAddresses);
router.post('/', authenticate, addressController.createAddress);
router.get('/favorite', authenticate, addressController.getFavoriteAddress);
router.get('/active', authenticate, addressController.getActiveAddresses);
router.get('/:id', authenticate, addressController.getAddressById);
router.put('/:id', authenticate, addressController.updateAddress);
router.patch('/:id', authenticate, addressController.updateAddressPartial);
router.delete('/:id', authenticate, addressController.deleteAddress);
router.patch('/:id/favorite', authenticate, addressController.setFavoriteAddress);

export default router;
