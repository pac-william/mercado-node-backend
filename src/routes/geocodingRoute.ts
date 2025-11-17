import { Router } from 'express';
import { GeocodingController } from '../controllers/geocodingController';

const router = Router();
const geocodingController = new GeocodingController();

router.get('/', geocodingController.geocode);
router.post('/', geocodingController.geocode);
router.get('/decode', geocodingController.reverseGeocode);
router.post('/decode', geocodingController.reverseGeocode);

export default router;

