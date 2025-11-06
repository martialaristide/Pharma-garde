import { Router } from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

router.post(
  '/register',
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  registerUser
);

router.post(
  '/login',
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required'),
  loginUser
);

export default router;