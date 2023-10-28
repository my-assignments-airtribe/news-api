import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/User";
import { loginSchema, registrationSchema } from "../validation/userValidation";
import { generateToken } from "../services/authService";
import {
  BadRequestError,
  UsernameTakenError,
  ValidationError,
} from "../utils/error-types";
import { generateEmailToken, sendEmail } from "../config/email";

// User Registration
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email } = req.body;
    // Validate request body against the registration schema
    const { error } = registrationSchema.validate(
      { username, password, email },
      { stripUnknown: true }
    );
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    // Check if the username is already in use
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw new UsernameTakenError("Username is already taken");
    }
    const url = process.env.NODE_ENV === "prod" ? process.env.CLIENT_URL : process.env.LOCAL_URL;

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = generateEmailToken(32);
    const verification = `Click Link to verify Email: ${url}/user/verify-email/${token}`;
    // Create a new user
    const newUser = new UserModel({
      username,
      token,
      password: hashedPassword,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: false,
      preferences: {
        categories: [],
        sources: [],
      },
    });
    await newUser.save();

    // Send a verification email to the user
    await sendEmail(email, "Verify your email", verification)
      .then(async () => {
        res.status(201).json({ message: "Verification Email sent" });
      })
      .catch((err) => {
        throw new Error(`Error sending verification email: ${err}`);
      });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // console.error("Caught an error:", error);
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.params.token;
    const user = await UserModel.findOne({ token: token as string });
    if (!user) {
      throw new BadRequestError("Invalid or expired verification token.");
    }
    user.emailVerified = true;
    await user.save();
    res.status(200).json({ message: "Email Verified" });
  } catch (error) {
    next(error);
  }
};

// User Login
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request body against the login schema
    const { error } = loginSchema.validate(req.body, { stripUnknown: true });
    if (error) {
      throw new ValidationError(error.details[0].message);
    }

    const { username, password } = req.body;

    // Find the user by their username
    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new BadRequestError("User does not exist");
    }

    if (!user.emailVerified) {
      throw new BadRequestError("Email not verified");
    }

    // Check if the provided password matches the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate and send an access token as a response
    const accessToken = generateToken(user.id || user._id);

    res.status(200).json({ accessToken });
  } catch (error) {
    // console.error(error);
    next(error);
  }
};
