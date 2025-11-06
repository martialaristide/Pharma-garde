import { Router } from 'express';
import { getVapidPublicKey, subscribe, unsubscribe } from '../controllers/notificationController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/vapid-key', getVapidPublicKey);
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

export default router;
