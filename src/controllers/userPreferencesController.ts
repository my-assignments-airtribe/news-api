import { Response } from "express";

import UserModel from "../models/User";
import { CustomRequest } from "../middleware/authMiddleware";

// Set User Preferences
export const setUserPreferences = async (req: CustomRequest, res: Response) => {
  try {
    const { userId, body } = req;
    const { categories, sources }: { categories?: string[]; sources?: string[] } = body;

    // Check if the user exists
    let existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const updatedCategories = categories ? [...existingUser.preferences.categories, ...categories] : existingUser.preferences.categories;
    const updatedSources = sources ? [...existingUser.preferences.sources, ...sources] : existingUser.preferences.sources;
  
    // Update preferences
    existingUser.preferences= {
      // update with unique values
      categories: [...new Set(updatedCategories)],
      sources: [...new Set(updatedSources)]
    }

    // Save the updated user preferences
    await existingUser.save().then((user) => {
      return res.status(201).json({ message: "Preferences updated successfully" });
    }).catch((error) => {
      console.error(error);
      return res.status(500).json({ message: "Error Writing to the DB" });
    });

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get User Preferences
export const getUserPreferences = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.userId;
    // Check if the user exists
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    // Return the user's preferences
    return res.status(200).json({ preferences: existingUser.preferences });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};