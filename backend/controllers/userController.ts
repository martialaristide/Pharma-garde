import { Response as ExpressResponse, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import knex from 'knex';
import config from '../knexfile';

const db = knex(config.development);

// FIX: Use aliased ExpressResponse type.
export const getUserProfile = (req: AuthenticatedRequest, res: ExpressResponse) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// FIX: Use aliased ExpressResponse type.
export const upgradeToPremium = async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        await db('users')
            .where({ id: req.user.id })
            .update({ membership: 'premium' });

        const updatedUser = await db('users').where({ id: req.user.id }).select('id', 'name', 'email', 'membership').first();

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};