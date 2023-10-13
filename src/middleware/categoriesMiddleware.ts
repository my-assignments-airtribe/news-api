import { Request, Response, NextFunction } from 'express';
import { isArrayofStrings } from '../utils/isArray';



export const categoriesMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if(!req.body) {
    return res.status(400).json({ message: "Invalid Request" });
  }
  const { categories, sources }: { categories?: string[]; sources?: string[] } = req.body;
    // if no categories or no sources, return one must be provided
    // categories can be of the type business entertainment general health science sports technology.
    const validCategories = ["business", "entertainment", "general", "health", "science", "sports", "technology"];
    if (!categories && !sources) {
      return res.status(400).json({ message: "One of categories or sources must be provided" });
    }
    if (categories && !isArrayofStrings(categories)) {
      return res.status(400).json({ message: "Categories must be an array of strings" });
    }
    if (categories && !categories.every((category: string) => validCategories.includes(category.toLowerCase().trim()))) {
      return res.status(400).json({ message: "Categories must be one of business, entertainment, general, health, science, sports, technology" });
    }
    if (sources && !isArrayofStrings(sources)) {
      return res.status(400).json({ message: "Sources must be an array of strings" });
    }
    next();
}

