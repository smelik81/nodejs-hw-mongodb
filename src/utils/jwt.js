import jwt from 'jsonwebtoken';

import { env } from './env.js';

const jwtSecret = env('JWT_SECRET');

export const createJwtToken = (payload) =>
  jwt.sign(payload, jwtSecret, { expiresIn: '5m' });
