import { Router } from 'express';
import { addressController } from '../controllers/addressController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

// Todas as rotas de endereço requerem autenticação
router.get('/', validateToken, addressController.getAddresses);
router.post('/', validateToken, addressController.createAddress);
router.get('/:id', validateToken, addressController.getAddressById);
router.put('/:id', validateToken, addressController.updateAddress);
router.patch('/:id', validateToken, addressController.updateAddressPartial);
router.delete('/:id', validateToken, addressController.deleteAddress);

export default router;
