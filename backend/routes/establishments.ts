import { Router } from 'express';
import { body } from 'express-validator';
import { getEstablishments, addReview, createEstablishment, updateEstablishmentStatus } from '../controllers/establishmentController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getEstablishments);

router.post(
    '/',
    protect,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('type').isIn(['pharmacy', 'hospital', 'healthCenter']).withMessage('Invalid establishment type'),
        body('address').notEmpty().withMessage('Address is required'),
        body('lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
        body('lon').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
        body('phone').notEmpty().withMessage('Phone number is required'),
        body('hours').isObject().withMessage('Hours must be an object'),
        body('photoUrl').optional({ checkFalsy: true }).isURL().withMessage('Photo URL must be a valid URL'),
        body('onDuty').isBoolean().withMessage('onDuty must be a boolean'),
        body('open24h').isBoolean().withMessage('open24h must be a boolean'),
    ],
    createEstablishment
);

router.put(
    '/:id/status',
    protect,
    [
        body('onDuty').isBoolean().withMessage('onDuty status is required and must be a boolean'),
    ],
    updateEstablishmentStatus
)

router.post(
    '/:id/reviews',
    protect,
    [
        body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
        body('comment').optional().isString().withMessage('Comment must be a string'),
    ],
    addReview
);

export default router;