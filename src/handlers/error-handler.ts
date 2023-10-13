import { Response, Request, NextFunction  } from "express";
import { AuthenticationError, AuthorizationError, BadRequestError, UsernameTakenError, ValidationError } from "../utils/error-types";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof ValidationError) {
    return res.status(400).json({ message: err.message });
  }
  if(err instanceof AuthenticationError) {
    return res.status(400).json({ message: err.message });
  }
  if(err instanceof AuthorizationError) {
    return res.status(403).json({ message: err.message });
  }
  if(err instanceof UsernameTakenError) {
    return res.status(400).json({ message: err.message });
  }
  if(err instanceof BadRequestError) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: "Server error" });
}