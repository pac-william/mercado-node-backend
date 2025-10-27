import { Router } from 'express';
import { addressController } from '../controllers/addressController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

// Todas as rotas de endereço requerem autenticação
router.get('/', validateToken, addressController.getAddresses);
router.post('/', validateToken, addressController.createAddress);
router.get('/favorite', validateToken, addressController.getFavoriteAddress);
router.get('/active', validateToken, addressController.getActiveAddresses);
router.get('/nearby', validateToken, addressController.getAddressesNearby);
router.get('/search/:zipCode', addressController.searchByZipCode);
router.post('/validate', addressController.validateAddress);
router.get('/:id', validateToken, addressController.getAddressById);
router.get('/:id/history', validateToken, addressController.getAddressHistory);
router.get('/:id/geolocation', validateToken, addressController.getAddressWithGeolocation);
router.put('/:id', validateToken, addressController.updateAddress);
router.patch('/:id', validateToken, addressController.updateAddressPartial);
router.patch('/:id/soft-delete', validateToken, addressController.softDeleteAddress);
router.patch('/:id/restore', validateToken, addressController.restoreAddress);
router.delete('/:id', validateToken, addressController.deleteAddress);
router.patch('/:id/favorite', validateToken, addressController.setFavoriteAddress);

export default router;
