import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User";
import { CustomRequest } from "./authMiddleware";
import { BadRequestError } from "../utils/error-types";

export const setReadArticleMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body || req.body === null) {
      throw new BadRequestError("Invalid Request");
    }
    let {
      readArticle,
    }: {
      readArticle: {
        articleUrl: string;
      };
    } = req.body;
    const userId = req.userId;
    if (!readArticle) {
      return res.status(400).json({ message: "readArticle must be provided" });
    }
    if (!readArticle.articleUrl) {
      return res.status(400).json({ message: "articleUrl must be provided" });
    }
    if (
      !readArticle.articleUrl.startsWith("http") &&
      !readArticle.articleUrl.startsWith("https")
    ) {
      return res
        .status(400)
        .json({ message: "articleUrl must be a valid url" });
    }
    const encodedArticleUrl = encodeURIComponent(readArticle.articleUrl.trim());
    const existingArticle = await UserModel.findOne({
      _id: userId,
      readArticles: { $elemMatch: { articleUrl: encodedArticleUrl } },
    });
    if (existingArticle) {
      return res.status(400).json({ message: "Article already read" });
    }
    if (readArticle.articleUrl) {
      req.body.readArticle.articleUrl = encodedArticleUrl;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const setFavoriteMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new BadRequestError("Invalid Request");
    }
    const {
      favoriteArticle,
    }: {
      favoriteArticle: {
        articleUrl: string;
      };
    } = req.body;
    const userId = req.userId;
    if (!favoriteArticle) {
      return res
        .status(400)
        .json({ message: "favoriteArticle must be provided" });
    }
    if (!favoriteArticle.articleUrl) {
      return res.status(400).json({ message: "articleUrl must be provided" });
    }
    if (
      !favoriteArticle.articleUrl.startsWith("http") &&
      !favoriteArticle.articleUrl.startsWith("https")
    ) {
      return res
        .status(400)
        .json({ message: "articleUrl must be a valid url" });
    }
    const encodedArticleUrl = encodeURIComponent(
      favoriteArticle.articleUrl.trim()
    );
    const existingArticle = await UserModel.findOne({
      _id: userId,
      favoriteArticles: { $elemMatch: { articleUrl: encodedArticleUrl } },
    });
    if (!!existingArticle) {
      return res
        .status(400)
        .json({ message: "Article already added to Favorites" });
    }

    if (favoriteArticle.articleUrl) {
      req.body.favoriteArticle.articleUrl = encodedArticleUrl;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const removeFavoriteMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body) {
      throw new BadRequestError("Invalid Request");
    }
    const {
      favoriteArticle,
    }: {
      favoriteArticle: {
        articleUrl: string;
      };
    } = req.body;
    const userId = req.userId;
    if (!favoriteArticle) {
      return res
        .status(400)
        .json({ message: "favoriteArticle must be provided" });
    }
    if (!favoriteArticle.articleUrl) {
      return res.status(400).json({ message: "articleUrl must be provided" });
    }
    if (
      !favoriteArticle.articleUrl.startsWith("http") &&
      !favoriteArticle.articleUrl.startsWith("https")
    ) {
      return res
        .status(400)
        .json({ message: "articleUrl must be a valid url" });
    }
    const encodedArticleUrl = encodeURIComponent(
      favoriteArticle.articleUrl.trim()
    );
    const existingArticle = await UserModel.findOne({
      _id: userId,
      favoriteArticles: { $elemMatch: { articleUrl: encodedArticleUrl } },
    });

    if (!existingArticle) {
      return res.status(400).json({ message: "Article not found in favorite" });
    }
    
    if (favoriteArticle.articleUrl) {
      req.body.favoriteArticle.articleUrl = encodedArticleUrl;
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const searchMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const keyword = req.params.keyword;
  if (!keyword) {
    return res.status(400).json({ message: "keyword must be provided" });
  }
  if (keyword && !keyword.trim()) {
    return res.status(400).json({ message: "keyword must be provided" });
  }
  if (keyword) {
    req.params.keyword = keyword.trim();
  }

  next();
};

export const getNewsArticlesMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  // fetch the user preferences from the DB
  UserModel.findById(userId).then((user) => {
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const { categories, sources } = user.preferences;
    if (!categories && !sources) {
      return res.status(400).json({
        status: "error",
        message:
          "Required parameters are missing, the scope of your search is too broad. Please set any of the following required parameters and try again: sources, q, language, country, category.",
      });
    }
    next();
  });
};
