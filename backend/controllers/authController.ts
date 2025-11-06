import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import knex from 'knex';
import config from '../knexfile';

const db = knex(config.development);

const generateToken = (id: number) => {
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET not configured.');
    throw new Error('Server configuration error preventing token generation.');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// FIX: Use aliased ExpressRequest and ExpressResponse types.
export const registerUser = async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const userExists = await db('users').where({ email }).first();
    if (userExists) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }]});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [newUserId] = await db('users').insert({
      name,
      email,
      password: hashedPassword,
    }).returning('id');

    const newUser = await db('users').where({ id: (newUserId as any).id || newUserId }).select('id', 'name', 'email', 'membership').first();

    if (newUser) {
      res.status(201).json({
        token: generateToken(newUser.id),
        user: newUser,
      });
    } else {
      throw new Error('User registration failed');
    }
  } catch (error) {
    next(error);
  }
};

// FIX: Use aliased ExpressRequest and ExpressResponse types.
export const loginUser = async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await db('users').where({ email }).first();

        if (user && (await bcrypt.compare(password, user.password))) {
            const userProfile = {
                id: user.id,
                name: user.name,
                email: user.email,
                membership: user.membership
            };
            res.json({
                token: generateToken(user.id),
                user: userProfile
            });
        } else {
            res.status(401).json({ errors: [{ msg: 'Invalid credentials' }] });
        }
    } catch (error) {
        next(error);
    }
};