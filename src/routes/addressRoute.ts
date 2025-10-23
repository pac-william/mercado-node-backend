import { Router } from 'express';
import { addressController } from '../controllers/addressController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Todas as rotas de endereço requerem autenticação
router.get('/', authenticate, addressController.getAddresses);
router.post('/', authenticate, addressController.createAddress);
router.get('/favorite', authenticate, addressController.getFavoriteAddress);
router.get('/active', authenticate, addressController.getActiveAddresses);
router.get('/nearby', authenticate, addressController.getAddressesNearby);
router.get('/search/:zipCode', addressController.searchByZipCode);
router.post('/validate', addressController.validateAddress);
router.get('/:id', authenticate, addressController.getAddressById);
router.get('/:id/history', authenticate, addressController.getAddressHistory);
router.get('/:id/geolocation', authenticate, addressController.getAddressWithGeolocation);
router.put('/:id', authenticate, addressController.updateAddress);
router.patch('/:id', authenticate, addressController.updateAddressPartial);
router.patch('/:id/soft-delete', authenticate, addressController.softDeleteAddress);
router.patch('/:id/restore', authenticate, addressController.restoreAddress);
router.delete('/:id', authenticate, addressController.deleteAddress);
router.patch('/:id/favorite', authenticate, addressController.setFavoriteAddress);

export default router;
