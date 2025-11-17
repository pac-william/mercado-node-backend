import { Router } from 'express';
import { campaignController } from '../controllers/campaignController';
import { validateToken } from '../middleware/validateToken';

const router = Router();

router.get('/carousel', campaignController.getActiveCampaignsForCarousel);
router.get('/market/:marketId', campaignController.getCampaignsByMarket);
router.get('/:id', campaignController.getCampaignById);

router.post('/', validateToken, campaignController.createCampaign);
router.put('/:id', validateToken, campaignController.updateCampaign);
router.patch('/:id/activate', validateToken, campaignController.activateCampaign);
router.patch('/:id/deactivate', validateToken, campaignController.deactivateCampaign);
router.delete('/:id', validateToken, campaignController.deleteCampaign);
router.post('/expire', validateToken, campaignController.expireCampaigns);

export default router;

