import axios, { AxiosResponse } from "axios";
import { IUser } from "../models/User";

export const fetchNews = async (user: IUser) => {
  const apiKey = process.env.NEWS_API_SECRET;
  const categories = user.preferences.categories;
  const sources = user.preferences.sources;
  const pageSize = 10; // Max 100 per request for free tier
  const page = 1; // only 1 page for free tier if pageSize is 100

  // Ensure environment variables are defined
  if (!apiKey || !process.env.NEWS_API_URL) {
    throw new Error("Missing environment variables.");
  }

  const requests: Promise<AxiosResponse<any>>[] = [];

  if (categories && categories.length > 0) {
    for (const category of categories) {
      requests.push(
        axios.get(`${process.env.NEWS_API_URL}/top-headlines`, {
          params: {
            apiKey,
            category,
            page,
            pageSize,
          },
        })
      );
    }
  }

  if (sources && sources.length > 0) {
    requests.push(
      axios.get(`${process.env.NEWS_API_URL}/top-headlines`, {
        params: {
          apiKey,
          sources: sources.join(","),
          page,
          pageSize,
        },
      })
    );
  }

  try {
    const responses = await Promise.all(requests);
    const articles = responses.map((response) => response.data.articles).flat();

    // If you want to filter articles based on sources, do it here

    return articles;
  } catch (error) {
    // Handle errors here
    console.error("Error fetching news:", error);
    throw error;
  }
};
