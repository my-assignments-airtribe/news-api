import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import UserModel from "../models/User";

// schemas for input validation
const registrationSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// User Registration
export const registerUser = async (req: Request, res: Response) => {
  try {
    // Validate request body against the registration schema
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password, email } = req.body;

    // Check if the username is already in use
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
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
      preferences: []
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
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = req.body;

    // Find the user by their username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the provided password matches the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate and send an access token as a response
    let accessToken;
    if (process.env.API_SECRET) {
      accessToken = jwt.sign(
        { id: user._id, name: user.username, email: user.email, preferences: user.preferences },
        process.env.API_SECRET,{
          expiresIn: "1d"
        }
      );
    } else {
      throw new Error("API_SECRET is not defined");
    }
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
