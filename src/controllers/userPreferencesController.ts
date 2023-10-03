import { Request, Response } from "express";

import UserModel from "../models/User";

// Set User Preferences
export const setUserPreferences = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get User Preferences
export const getUserPreferences = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};