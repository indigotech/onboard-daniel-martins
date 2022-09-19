import { JWTPayload } from '../interfaces';
import { createHmac } from 'crypto';
import { CustomError } from '../../format-error';
import * as jwt from 'jsonwebtoken';

export const tokenSecret = 'Understanding how to fly into w@ll5';

export function hashString(str: string) {
  const hash = createHmac('sha256', 'internalizing server behavior');
  return hash.update(str).digest('hex');
}

export function createToken(userID: number, rememberMe = false) {
  return jwt.sign({ userID: userID }, tokenSecret, rememberMe ? { expiresIn: '7d' } : undefined);
}

export function authenticateToken(token: string) {
  try {
    const tokenPayload = jwt.verify(token, tokenSecret) as JWTPayload;
    if (!tokenPayload.userID || !tokenPayload.iat) {
      throw new Error('jwt token missing expected fields');
    }
    if (tokenPayload.userID <= 0) {
      throw new Error('jwt token has invalid user id');
    }
  } catch (err) {
    throw new CustomError('Login error, please try to sign in again.', 401, err.message);
  }
}
