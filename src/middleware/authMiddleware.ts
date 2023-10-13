import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';
import { AuthorizationError } from '../utils/error-types';

export interface CustomRequest extends Request {
  userId?: string;
}

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  // console.log(req.headers.authorization)
  // Unauthorized
  if (!token) {
    throw new AuthorizationError("Unauthorized");
  }

  // Validate the token
  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    throw new AuthorizationError("Unauthorized");
  }
  req.userId = decodedToken.userId || decodedToken.userId;
  next();
};
