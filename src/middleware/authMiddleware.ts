import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';

export interface CustomRequest extends Request {
  userId?: string;
}

export const authenticateJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  // console.log(req.headers.authorization)
  // Unauthorized
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }

  // Validate the token
  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return res.sendStatus(403); // Forbidden
  }
  req.userId = decodedToken.user._id;
  next();
};
