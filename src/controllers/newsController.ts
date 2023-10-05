import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import axios from "axios";
import UserModel from "../models/User";
import { getCache, setCache } from "../services/cacheServie";
import { fetchNews } from "../services/fetchNewsService";

export const getNewsArticles = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;
    let existingUser = await UserModel.findById(userId).select('preferences');
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const cacheKey = `news-${existingUser._id}`
    const cachedNews = getCache(cacheKey);

    if (cachedNews && cachedNews.length > 0) {
      console.log('Using cached news...');
      return res.status(200).json({ cachedArticles: cachedNews, totalCachedArticles: cachedNews.length });
    }
    const articles = await fetchNews(existingUser);
    setCache(cacheKey, articles, 3600);
    return res
      .status(200)
      .json({ articles: articles, totalArticles: articles.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getReadArticles = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;
    let existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const readArticles = existingUser.readArticles.map((article) => {
      return {
        articleUrl: decodeURIComponent(article.articleUrl),
        readAt: article.readAt,
      };
    });
    return res.status(200).json({ readArticles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const setReadArticles = async (req: CustomRequest, res: Response) => {
  try {
    const { userId, body } = req;
    let existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    let { readArticle } = body;
    readArticle.readAt = new Date().toISOString();
    existingUser.readArticles = [
      ...new Set([...existingUser.readArticles, readArticle]),
    ];
    await existingUser.save();
    return res
      .status(200)
      .json({ message: "Read articles updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getFavoriteArticles = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;
    let existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const favoriteArticles = existingUser.favoriteArticles.map((article) => {
      return {
        articleUrl: decodeURIComponent(article.articleUrl),
        favoritedAt: article.favoritedAt,
      };
    });
    return res.status(200).json({ favoriteArticles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export const setFavoriteArticles = async (req: CustomRequest, res: Response) => {
  try {
    const { userId, body } = req;
    let existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    let { favoriteArticle } = body;
    favoriteArticle.favoritedAt = new Date().toISOString();
    existingUser.favoriteArticles = [
      ...new Set([...existingUser.favoriteArticles, favoriteArticle]),
    ];
    await existingUser.save();
    return res
      .status(200)
      .json({ message: "Favorite articles updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export const removeFavoriteArticle = async (req: CustomRequest, res: Response) => {
  try {
    const { userId, body } = req;
    let existingUser = await UserModel.findById(userId);
    

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    let { favoriteArticle } = body;
    existingUser.favoriteArticles = existingUser.favoriteArticles.filter((article) => article.articleUrl !== favoriteArticle.articleUrl);
    await existingUser.save();
    return res
      .status(200)
      .json({ message: "Favorite articles updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

export const searchNewsArticles = async (req: CustomRequest, res: Response) => {
  try {
    const { userId } = req;
    let existingUser = await UserModel.findById(userId);
    const keyword = req.params.keyword;

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const apiKey = process.env.NEWS_API_SECRET;
    const response = await axios.get(`${process.env.NEWS_API_URL}/top-headlines`, {
      params: {
        apiKey,
        q: keyword,
      },
    });
    const articles = response.data.articles;
    return res
      .status(200)
      .json({ articles: articles, totalArticles: articles.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}
