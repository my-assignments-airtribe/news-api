import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from '../../controllers/userController';
import { ValidationError, UsernameTakenError, BadRequestError } from '../../utils/error-types';
import UserModel from "../../models/User";
import bcrypt from "bcrypt";

jest.mock("bcrypt");

jest.mock("../../models/User");

describe('User Controller', () => {
  let res: Response<any, Record<string, any>>;
  let next: NextFunction;
  let req: Request;
  describe('registerUser', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response<any, Record<string, any>>;
      next = jest.fn();
      req = {
        body: {
          username: 'testuser',
          password: 'testpassword',
          email: 'test@example.com',
        }
      } as Request;
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should register a new user', async () => {

      // mock the save method
      const save = jest.fn();
      // mock the constructor
      const mockUser = jest.fn().mockImplementation(() => {
        return { save };
      });
      // @ts-ignore
      UserModel.mockImplementation(mockUser);
      await registerUser(req, res, next);
    
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle validation error', async () => {
      req.body.email = 'invalidemail';
      // mock the save method
      const save = jest.fn();
      // mock the constructor
      const mockUser = jest.fn().mockImplementation(() => {
        return { save };
      });
      // @ts-ignore
      UserModel.mockImplementation(mockUser);

      await registerUser(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should handle username already taken error', async () => {
      // mock the save method
      const save = jest.fn();
      // mock the constructor
      const mockUser = jest.fn().mockImplementation(() => {
        return { save };
      });
      // @ts-ignore
      UserModel.mockImplementation(mockUser);
      // mock the findOne method
      const findOne = jest.fn().mockResolvedValue({ username: 'testuser' });
      // @ts-ignore
      UserModel.findOne = findOne;

      await registerUser(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(UsernameTakenError));
    });

    // Add more test cases for other scenarios
  });

  describe('loginUser', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response<any, Record<string, any>>;
      next = jest.fn();
      req = {
        body: {
          username: 'testuser',
          password: 'testpassword',
        }
      } as Request;
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
    it('should login a user with valid credentials', async () => {
      // mock the findOne method
      (UserModel.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue({
          username: 'testuser',
          password: 'testpassword',
        }),
      }));

      // mock the password bycrypt compare method
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ accessToken: expect.any(String) });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle invalid credentials error', async () => {
      // mock the findOne method
      (UserModel.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue({
          username: 'testuser',
          password: 'testpassword',
        }),
      }));

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await loginUser(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('should handle validation error', async () => {
      req.body.password = '';
      await loginUser(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should handle user not found error', async () => {
      // mock the findOne method
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);

      await loginUser(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });
});