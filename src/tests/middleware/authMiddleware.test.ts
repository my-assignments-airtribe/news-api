import {Response, NextFunction } from 'express';
import { authenticateJWT, CustomRequest } from '../../middleware/authMiddleware';
import { verifyToken } from '../../services/authService';
import { AuthorizationError } from '../../utils/error-types';

jest.mock('../../services/authService');

describe('authenticateJWT middleware', () => {
  let req: CustomRequest;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    } as CustomRequest;
    res = {} as Response;
    next = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an AuthorizationError if no token is provided', () => {
    expect(() => authenticateJWT(req, res, next)).toThrow(AuthorizationError);
  });

  it('should throw an AuthorizationError if the token is invalid', () => {
    req.headers.authorization = 'invalid-token';
    (verifyToken as jest.Mock).mockReturnValue(null);

    expect(() => authenticateJWT(req, res, next)).toThrow(AuthorizationError);
  });

  it('should set the userId on the request object if the token is valid', () => {
    const decodedToken = {
      userId: 'user-id',
    };
    req.headers.authorization = 'valid-token';
    (verifyToken as jest.Mock).mockReturnValue(decodedToken);

    authenticateJWT(req, res, next);

    expect(req.userId).toBe(decodedToken.userId);
    expect(next).toHaveBeenCalled();
  });

  it('should set the userId on the request object if the token is valid', () => {
    const decodedToken = {
      userId: 'user-id',
    };
    req.headers.authorization = 'valid-token';
    (verifyToken as jest.Mock).mockReturnValue(decodedToken);

    authenticateJWT(req, res, next);

    expect(req.userId).toBe(decodedToken.userId);
    expect(next).toHaveBeenCalled();
  });
});

