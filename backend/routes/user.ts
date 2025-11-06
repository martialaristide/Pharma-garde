import { Router } from 'express';
import { getUserProfile, upgradeToPremium } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/me', protect, getUserProfile);
router.post('/subscribe', protect, upgradeToPremium);

export default router;