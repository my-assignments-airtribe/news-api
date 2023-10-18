import { NextFunction, Response } from "express";

import UserModel from "../models/User";
import { CustomRequest } from "../middleware/authMiddleware";
import { preferencesSchema, removePreferencesSchema } from "../validation/userValidation";
import { BadRequestError, ValidationError } from "../utils/error-types";

// Set User Preferences
export const setUserPreferences = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, body } = req;
    const { categories, sources }: { categories?: string[]; sources?: string[] } = body;

    // Check if the user exists
    const userQuery = UserModel.findById(userId);

    const existingUser = await userQuery.exec();

    if (!existingUser) {
      throw new BadRequestError("User does not exist");
    }

    // Validate request body against the preferences schema
    const { error } = preferencesSchema.validate({ categories, sources }, { stripUnknown: true });

    if (error) {
      throw new BadRequestError("Invalid preferences data");
    }

    // Update preferences
    if (categories) {
      existingUser.preferences.categories = [...new Set([...existingUser.preferences.categories, ...categories])];
    }
    if (sources) {
      existingUser.preferences.sources = [...new Set([...existingUser.preferences.sources, ...sources])];
    }

    // Save the updated user preferences
    await existingUser.save();
    
    res.status(201).json({ message: "Preferences updated successfully" });

  } catch (error) {
    next(error);
  }
};



// Get User Preferences
export const getUserPreferences = async (req: CustomRequest, res: Response, next:NextFunction) => {
  try {
    const userId = req.userId;
    // Check if the user exists
    const userQuery = UserModel.findById(userId);

    const existingUser = await userQuery.exec();
    if (!existingUser) {
      throw new BadRequestError("User does not exist");
    }
    // Return the user's preferences
    return res.status(200).json({ preferences: existingUser.preferences });

  } catch (error) {
    next(error);
  }
};

// Remove User Preferences
export const removeUserPreferences = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, body } = req;
    const { removeCategories, removeSources }: { removeCategories?: string[]; removeSources?: string[] } = body;

    // Check if the user exists
    const userQuery = UserModel.findById(userId);

    const existingUser = await userQuery.exec();

    if (!existingUser) {
      throw new BadRequestError("User does not exist");
    }

    // Validate request body against the remove preferences schema
    const { error } = removePreferencesSchema.validate({ removeCategories, removeSources }, { stripUnknown: true });

    if (error) {
      throw new BadRequestError("Invalid remove preferences data");
    }

    // Update preferences
    if (removeCategories) {
      existingUser.preferences.categories = existingUser.preferences.categories.filter(
        (category) => !removeCategories.includes(category)
      );
    }
    if (removeSources) {
      existingUser.preferences.sources = existingUser.preferences.sources.filter(
        (source) => !removeSources.includes(source)
      );
    }

    // Save the updated user preferences
    await existingUser.save();
    
    res.status(201).json({ message: "Preferences updated successfully" });

  } catch (error) {
    next(error);
  }
};
