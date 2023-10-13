import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/User";
import { loginSchema, registrationSchema } from "../validation/userValidation";
import { generateToken } from "../services/authService";
import { BadRequestError, UsernameTakenError, ValidationError } from "../utils/error-types";

// User Registration
export const registerUser = async (req: Request, res: Response) => {
  try {

    const { username, password, email } = req.body;
    // Validate request body against the registration schema
    const { error } = registrationSchema.validate({username, password, email}, { stripUnknown: true });
    if (error) {
      throw new ValidationError(error.details[0].message);
    }
    // Check if the username is already in use
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      throw new UsernameTakenError("Username is already taken");
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        categories: [],
        sources: []
      }
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// User Login
export const loginUser = async (req: Request, res: Response) => {
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
      throw new BadRequestError("Invalid credentials");
    }

    // Check if the provided password matches the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate and send an access token as a response
    const accessToken = generateToken(user);

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
