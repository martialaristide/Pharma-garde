import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import knex from 'knex';
import config from '../knexfile';

const db = knex(config.development);


// Using an interface to extend the Express Request type.
// FIX: Extend aliased ExpressRequest to ensure correct type inheritance.
export interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    id: number;
    name: string;
    email: string;
    membership: string;
  }
}

// FIX: Use aliased types for request and response objects.
export const protect = async (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
  let token;

  if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    return res.status(500).json({ message: 'Internal server configuration error.' });
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };
      
      const user = await db('users').where({ id: decoded.id }).select('id', 'name', 'email', 'membership').first();

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// FIX: Use aliased ExpressResponse type for the response object.
export const premiumOnly = (req: AuthenticatedRequest, res: ExpressResponse, next: NextFunction) => {
    if (req.user && req.user.membership === 'premium') {
        next();
    } else {
        res.status(403).json({ message: 'Premium membership required for this feature' });
    }
};