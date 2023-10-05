import { Request, Response, NextFunction } from 'express';
import  UserModel  from '../models/User';
import { CustomRequest } from './authMiddleware';

export const setReadArticleMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    let { readArticle }: { 
      readArticle: {
        articleUrl: string;
      }
    } = req.body;
    const userId = req.userId;
    const encodedArticleUrl = encodeURIComponent(readArticle.articleUrl.trim());
    const existingArticle = await UserModel.findOne({ _id: userId, readArticles: { $elemMatch: { articleUrl: encodedArticleUrl } } });
    if (existingArticle) {
      return res.status(400).json({ message: "Article already read" });
    }
    if (!readArticle) {
      return res.status(400).json({ message: "readArticle must be provided" });
    }
    if (!readArticle.articleUrl) {
      return res.status(400).json({ message: "articleUrl must be provided" });
    }
    if(!readArticle.articleUrl.startsWith("http") && !readArticle.articleUrl.startsWith("https")) {
      return res.status(400).json({ message: "articleUrl must be a valid url" });
    }
    if (readArticle.articleUrl) {
      req.body.readArticle.articleUrl = encodedArticleUrl;
    }
    next();
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const setFavoriteMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { favoriteArticle }: { 
      favoriteArticle: {
        articleUrl: string;
      }
    } = req.body;
    const userId = req.userId;
    const encodedArticleUrl = encodeURIComponent(favoriteArticle.articleUrl.trim());
    const existingArticle = await UserModel.findOne({ _id: userId, readArticles: { $elemMatch: { articleUrl: encodedArticleUrl } } });
    if (existingArticle) {
      return res.status(400).json({ message: "Article already added to Favorites" });
    }
    if (!favoriteArticle) {
      return res.status(400).json({ message: "favoriteArticle must be provided" });
    }
    if (!favoriteArticle.articleUrl) {
      return res.status(400).json({ message: "articleUrl must be provided" });
    }
    if(!favoriteArticle.articleUrl.startsWith("http") && !favoriteArticle.articleUrl.startsWith("https")) {
      return res.status(400).json({ message: "articleUrl must be a valid url" });
    }
    if (favoriteArticle.articleUrl) {
      req.body.favoriteArticle.articleUrl = encodedArticleUrl;
    }
    next();
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const removeFavoriteMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { favoriteArticle }: { 
      favoriteArticle: {
        articleUrl: string;
      }
    } = req.body;
    const userId = req.userId;
    const encodedArticleUrl = encodeURIComponent(favoriteArticle.articleUrl.trim());
    const existingArticle = await UserModel.findOne({ _id: userId, readArticles: { $elemMatch: { articleUrl: encodedArticleUrl } } });
    if (!existingArticle) {
      return res.status(400).json({ message: "Article not found in favorite" });
    }
    if(existingArticle.favoriteArticles.length === 0) {
      return res.status(400).json({ message: "Article not found in favorite" });
    }
    if (!favoriteArticle) {
      return res.status(400).json({ message: "favoriteArticle must be provided" });
    }
    if (!favoriteArticle.articleUrl) {
      return res.status(400).json({ message: "articleUrl must be provided" });
    }
    if(!favoriteArticle.articleUrl.startsWith("http") && !favoriteArticle.articleUrl.startsWith("https")) {
      return res.status(400).json({ message: "articleUrl must be a valid url" });
    }
    if (favoriteArticle.articleUrl) {
      req.body.favoriteArticle.articleUrl = encodedArticleUrl;
    }
    next();
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export const searchMiddleware = (req: Request, res: Response, next: NextFunction) => {
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
}
