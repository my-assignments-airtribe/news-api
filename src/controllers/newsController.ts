import { Response } from "express";
import { CustomRequest } from "../middleware/authMiddleware";
import axios from "axios";
import UserModel from "../models/User";

export const getNewsArticles = async (req: CustomRequest, res: Response) => {
  try {
    const { userId, body } = req;
    let existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }
    
    const apiKey = process.env.NEWS_API_SECRET;
      const categories = existingUser.preferences.categories;
      const sources = existingUser.preferences.sources.join(',');
      const pageSize = 100; 
      const page = 1;
  
      // using newsapi.org
      // cannot club categories and sources together
      // category is a query param and is a string
      // sources is a query param and is comma separated string
      // for each category in categories, make a request to newsapi.org
      // console.log(await axios.get(`https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&category=${categories[0]}`))
      const articles = await Promise.all(categories.map(async (category: string) => {
        // cannot club categories and sources together in this api
        const response = await axios.get(`${process.env.NEWS_API_URL}/top-headlines`, {
          params: {
            apiKey,
            category,
            page,
            pageSize,
          },
        });
        return response.data.articles;
      }));
      // Filter the articles based on the sources of the user
      const filteredArticles = articles.map((article: any) => {
        if(sources.length === 0) {
          return article;
        }
        return article.filter((a: any) => sources.includes(a.source.id));
      });
      const flatArticles = filteredArticles.flat();
      return res.status(200).json({ articles: flatArticles, totalArticles: flatArticles.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}