// import request from "supertest";
// import app from "../../app";
// import UserModel from "../../models/User";
// import { MongoMemoryServer } from "mongodb-memory-server";
// import mongoose, { ConnectOptions } from "mongoose";
// // import { generateToken } from "src/services/authService";
// // jest.mock("../../models/User")

// let mongoServer: MongoMemoryServer;

// beforeAll(async () => {
//   mongoServer = new MongoMemoryServer();
//   await mongoServer.start(); // Use start to initiate the MongoDB server
//   const mongoUri = mongoServer.getUri(); // Get the URI after starting
//   const mongooseOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   } as ConnectOptions;
//   await mongoose.connect(mongoUri, mongooseOptions);
// });

// afterEach(async () => {
//   // Clear the UserModel collection after each test
//   await UserModel.deleteMany({});
// });

// afterAll(async () => {
//   await mongoose.connection.close();
//   await mongoServer.stop();
//   app.close();
// });
// describe("User Controller", () => {

//   describe("POST /register", () => {
//     it("should register a new user", async () => {
//       const res = await request(app)
//         .post("/user/register")
//         .send({
//           username: "testuser",
//           password: "testpassword",
//           email: "testuser@example.com",
//         })
//         .expect(201);

//       expect(res.body.message).toBe("User registered successfully");

//       const user = await UserModel.findOne({ username: "testuser" });
//       expect(user).toBeTruthy();
//       expect(user?.username).toBe("testuser");
//       expect(user?.email).toBe("testuser@example.com");
//     });

//     it("should return a 400 error if the username is already taken", async () => {
//       const existingUser = new UserModel({
//         username: "existinguser",
//         password: "testpassword",
//         email: "existinguser@example.com",
//       });
//       await existingUser.save();

//       const res = await request(app)
//         .post("/user/register")
//         .send({
//           username: "existinguser",
//           password: "testpassword",
//           email: "testuser@example.com",
//         })
//         .expect(400);

//       expect(res.body.message).toBe("Username is already taken");
//     });

//     it("should return a 400 error if the request body is invalid", async () => {
//       const res = await request(app)
//         .post("/user/register")
//         .send({
//           username: "testuser",
//           password: "testpassword",
//         })
//         .expect(400);

//       expect(res.body.message).toBe(
//         "\"email\" is required"
//       );
//     });
//   });

//   describe("POST /login", () => {
//     beforeEach(async () => {
//       // create a user
//       await request(app)
//         .post("/user/register")
//         .send({
//           username: "testuser1",
//           password: "testpassword",
//           email: "testuser@example.com",
//         })
//     });

//     afterEach(async () => {
//       await UserModel.deleteMany({});
//     });
//     it("should log in a user with valid credentials", async () => {
      

//       const res = await request(app)
//         .post("/user/login")
//         .send({
//           username: "testuser1",
//           password: "testpassword",
//         })
//         .expect(200);

//       expect(res.body.accessToken).toBeTruthy();
//       expect(res.status).toBe(200);
//     });
    

//     it("should return a 400 error if the credentials are invalid", async () => {

//       const res = await request(app)
//         .post("/user/login")
//         .send({
//           username: "testuser2",
//           password: "wrongpassword",
//         })
//         .expect(400);

//       expect(res.body.message).toBe("Invalid credentials");
//     });

//     it("should return a 400 error if the request body is invalid", async () => {
//       const res = await request(app)
//         .post("/user/login")
//         .send({
//           username: "testuser1",
//         })
//         .expect(400);

//       expect(res.body.message).toBe(
//         "\"password\" is required"
//       );
//     });
//   });
// });
import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from '../../controllers/userController';
import { ValidationError, UsernameTakenError, BadRequestError } from '../../utils/error-types';

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

      await registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle validation error', async () => {
      req.body.email = 'invalidemail';

      await registerUser(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should handle username already taken error', async () => {
      req.body.username = 'testuser';

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

      await loginUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ accessToken: expect.any(String) }));
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle validation error', async () => {
      req.body.password = '';

      await loginUser(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    });

    it('should handle invalid credentials error', async () => {
      req.body.password = 'wrongpassword';

      await loginUser(req, res, next);

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    // Add more test cases for other scenarios
  });
});