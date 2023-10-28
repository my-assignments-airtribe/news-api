import { Request, Response } from "express";
import { errorHandler } from "../../handlers/error-handler";
import { AuthenticationError, AuthorizationError, BadRequestError, UsernameTakenError, ValidationError } from "../../utils/error-types";

describe("errorHandler", () => {
  let req: Request;
  let res: Response;
  let next: jest.Mock;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  it("should handle ValidationError", () => {
    const err = new ValidationError("Invalid input");
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid input" });
  });

  it("should handle AuthenticationError", () => {
    const err = new AuthenticationError("Invalid credentials");
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  it("should handle AuthorizationError", () => {
    const err = new AuthorizationError("Unauthorized access");
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized access" });
  });

  it("should handle UsernameTakenError", () => {
    const err = new UsernameTakenError("Username already taken");
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Username already taken" });
  });

  it("should handle BadRequestError", () => {
    const err = new BadRequestError("Bad request");
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Bad request" });
  });

  it("should handle other errors", () => {
    const err = new Error("Internal server error");
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});