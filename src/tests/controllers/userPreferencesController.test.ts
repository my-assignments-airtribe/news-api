import { setUserPreferences, getUserPreferences, removeUserPreferences } from '../../controllers/userPreferencesController';
import UserModel, { IUser } from '../../models/User';
import { BadRequestError } from '../../utils/error-types';
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../../middleware/authMiddleware";

// Mock UserModel.findById function
jest.mock("../../models/User");

describe('userPreferencesController', () => {
  let req: CustomRequest;
  let res: Response;
  let next: NextFunction;
  let existingUser: any;

  beforeEach(() => {
    jest.resetAllMocks();
    req = {
      userId: 'user123',
      body: {
        categories: ['category1'],
        sources: ['source1'],
      },
    } as unknown as CustomRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    next = jest.fn();

    existingUser = {
      preferences: {
        categories: ['category2'],
        sources: ['source2'],
      },
      save: jest.fn(),
    };
    
    (UserModel.findById as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(existingUser),
    }));

  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('setUserPreferences', () => {
    it('should update user preferences and return success message', async () => {
      await setUserPreferences(req, res, next);

      expect(UserModel.findById).toHaveBeenCalledWith('user123');
      expect(existingUser.preferences.categories).toEqual(['category2', 'category1']);
      expect(existingUser.preferences.sources).toEqual(['source2', 'source1']);
      expect(existingUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Preferences updated successfully' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if user does not exist', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      await setUserPreferences(req, res, next);

      expect(UserModel.findById).toHaveBeenCalledWith('user123');
      expect(next).toHaveBeenCalledWith(new BadRequestError('User does not exist'));
    });

    it('should throw BadRequestError if request body is invalid', async () => {
      req.body = {
        categories: 'category1',
        sources: 'source1',
      };

      await setUserPreferences(req, res, next);

      expect(UserModel.findById).toHaveBeenCalledWith('user123');
      expect(next).toHaveBeenCalledWith(new BadRequestError('Invalid preferences data'));
    });
  });

  describe('getUserPreferences', () => {
    it('should return user preferences', async () => {
      await getUserPreferences(req, res, next);

      expect(UserModel.findById).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ preferences: existingUser.preferences });
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if user does not exist', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      await getUserPreferences(req, res, next);

      expect(UserModel.findById).toHaveBeenCalledWith('user123');
      expect(next).toHaveBeenCalledWith(new BadRequestError('User does not exist'));
    });
  });

  describe('removeUserPreferences', () => {
    it('should remove user preferences and return success message', async () => {
      req.body.removeCategories = ['category1'];
      req.body.removeSources = ['source1'];

      await removeUserPreferences(req, res, next);

      expect(UserModel.findById).toHaveBeenCalledWith('user123');
      expect(existingUser.preferences.categories).toEqual(['category2']);
      expect(existingUser.preferences.sources).toEqual(['source2']);
      expect(existingUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Preferences updated successfully' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if request body is invalid', async () => {
      req.body = {
        removeCategories: 'category1',
        removeSources: 'source1',
      };

      await removeUserPreferences(req, res, next);

      expect(UserModel.findById).toHaveBeenCalledWith('user123');
      expect(next).toHaveBeenCalledWith(new BadRequestError('Invalid remove preferences data'));
    });

    it('should throw BadRequestError if user does not exist', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      await removeUserPreferences(req, res, next);

      expect(UserModel.findById).toHaveBeenCalledWith('user123');
      expect(next).toHaveBeenCalledWith(new BadRequestError('User does not exist'));
    });
  });
});