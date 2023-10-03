import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
  userId?: any;
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

  jwt.verify(token, process.env.API_SECRET as string, (err, decoded) => {
    if (err) {
      // Forbidden
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    // Attach the user object to the request for use in route handlers
    req.userId = (decoded as JwtPayload).id;

    next(); // Continue to the next middleware or route handler
  });
};
