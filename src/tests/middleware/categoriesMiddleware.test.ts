import { Request, Response, NextFunction } from 'express';
import { categoriesMiddleware } from '../../middleware/categoriesMiddleware';
import { CustomRequest } from '../../middleware/authMiddleware';

describe('categoriesMiddleware', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as CustomRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  it('should return 400 if no body is provided', () => {
    categoriesMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Request' });
  });

  it('should return 400 if neither categories nor sources are provided', () => {
    req.body = {};
    categoriesMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'One of categories or sources must be provided' });
  });

  it('should return 400 if categories is not an array of strings', () => {
    req.body = { categories: 'not an array' };
    categoriesMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Categories must be one of business, entertainment, general, health, science, sports, technology' });
  });

  it('should return 400 if categories contains an invalid category', () => {
    req.body = { categories: ['business', 'invalid', 'health'] };
    categoriesMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Categories must be one of business, entertainment, general, health, science, sports, technology' });
  });

  it('should not return an error if categories is a valid array of strings', () => {
    req.body = { categories: ['business', 'entertainment'] };
    categoriesMiddleware(req, res, next);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if sources is not an array of strings', () => {
    req.body = { sources: 'not an array' };
    categoriesMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Sources must be an array of strings' });
  });

  it('should not return an error if sources is a valid array of strings', () => {
    req.body = { sources: ['source1', 'source2'] };
    categoriesMiddleware(req, res, next);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should not return an error if both categories and sources are provided and valid', () => {
    req.body = { categories: ['business'], sources: ['source1'] };
    categoriesMiddleware(req, res, next);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});