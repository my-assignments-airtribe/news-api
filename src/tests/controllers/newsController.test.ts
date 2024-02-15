import { getNewsArticles, getReadArticles, setReadArticles, getFavoriteArticles, setFavoriteArticles, removeFavoriteArticle, searchNewsArticles } from "../../controllers/newsController";
import { BadRequestError } from "../../utils/error-types";
import UserModel from "../../models/User";
import { getCache, setCache } from "../../services/cacheServie";
import { fetchNews } from "../../services/fetchNewsService";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../../middleware/authMiddleware";

jest.mock("../../services/cacheServie");
jest.mock("../../services/fetchNewsService");
jest.mock("../../models/User");

describe("News Controller", () => {
  let res: Response<any, Record<string, any>>;
  let next: NextFunction;
  let req: CustomRequest;
  describe("getNewsArticles", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response<any, Record<string, any>>;
      next = jest.fn();
      req = {
        userId: "testUserId",
      } as CustomRequest;
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
    it("should return cached articles if available", async () => {
      const existingUser = {
        _id: "testUserId",
        preferences: {
          categories: ["business"],
        },
      };

      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(existingUser),
      }));

      const cachedNews = [{ title: "Article 1" }, { title: "Article 2" }];
      // @ts-ignore
      getCache.mockReturnValue(cachedNews);

      await getNewsArticles(req, res, next);

      expect(getCache).toHaveBeenCalledWith(`news-${existingUser._id}`);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        cachedArticles: cachedNews,
        totalCachedArticles: cachedNews.length,
      });
      expect(fetchNews).not.toHaveBeenCalled();
      expect(setCache).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it("should fetch articles and cache them if not available in cache", async () => {
      const existingUser = {
        _id: "testUserId",
      };

      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(existingUser),
      }));

      const articles = [{ title: "Article 1" }, { title: "Article 2" }];
      // @ts-ignore
      fetchNews.mockResolvedValue(articles);

      await getNewsArticles(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        articles: articles,
        totalArticles: articles.length,
      });
      expect(fetchNews).toHaveBeenCalledWith(existingUser);
      expect(setCache).toHaveBeenCalledWith(
        `news-${existingUser._id}`,
        articles,
        3600
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle error if user does not exist", async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      }));

      await getNewsArticles(req, res, next);

      expect(fetchNews).not.toHaveBeenCalled();
      expect(setCache).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe("getReadArticles", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response<any, Record<string, any>>;
      next = jest.fn();
      req = {
        userId: "testUserId",
      } as CustomRequest;
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    it("should return read articles", async () => {
      const existingUser = {
        _id: "testUserId",
        readArticles: [
          {
            articleUrl: "https://www.google.com",
            readAt: new Date().toISOString(),
          },
        ],
      };
      (UserModel.findById as jest.Mock).mockResolvedValue(existingUser);
      await getReadArticles(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        readArticles: existingUser.readArticles,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return read articles as [] if no read articles", async () => {
      const existingUser = {
        _id: "testUserId",
        readArticles: [
        ],
      };
      (UserModel.findById as jest.Mock).mockResolvedValue(existingUser);
      await getReadArticles(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        readArticles: existingUser.readArticles,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle error if user does not exist", async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      await getReadArticles(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe("setReadArticles", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response<any, Record<string, any>>;
      next = jest.fn();
      req = {
        userId: "testUserId",
        body: {
          readArticle: {
            articleUrl: "https://www.google.com",
          },
        },
      } as CustomRequest;
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    it("should set read articles", async () => {
      const existingUser = {
        _id: "testUserId",
        readArticles: [
          {
            articleUrl: "https://www.google.com",
            readAt: new Date().toISOString(),
          },
        ],
        save: jest.fn(),
      };
      (UserModel.findById as jest.Mock).mockResolvedValue(existingUser);
      await setReadArticles(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Read articles updated successfully",
      });
      expect(existingUser.save).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle error if user does not exist", async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      await setReadArticles(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe("getFavoriteArticles", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response<any, Record<string, any>>;
      next = jest.fn();
      req = {
        userId: "testUserId",
      } as CustomRequest;
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    it("should return favorite articles", async () => {
      const existingUser = {
        _id: "testUserId",
        favoriteArticles: [
          {
            articleUrl: "https://www.google.com",
          },
        ],
      };
      (UserModel.findById as jest.Mock).mockResolvedValue(existingUser);
      await getFavoriteArticles(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        favoriteArticles: existingUser.favoriteArticles,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return favorite articles as [] if no favorite articles", async () => {
      const existingUser = {
        _id: "testUserId",
        favoriteArticles: [
        ],
      };
      (UserModel.findById as jest.Mock).mockResolvedValue(existingUser);
      await getFavoriteArticles(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        favoriteArticles: existingUser.favoriteArticles,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle error if user does not exist", async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      await getFavoriteArticles(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe("setFavoriteArticles", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response<any, Record<string, any>>;
      next = jest.fn();
      req = {
        userId: "testUserId",
        body: {
          favoriteArticle: {
            articleUrl: "https://www.google.com",
          },
        },
      } as CustomRequest;
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    it("should set favorite articles", async () => {
      const existingUser = {
        _id: "testUserId",
        favoriteArticles: [
          {
            articleUrl: "https://www.google.com",
            favoritedAt: new Date().toISOString(),
          },
        ],
        save: jest.fn(),
      };
      (UserModel.findById as jest.Mock).mockResolvedValue(existingUser);
      await setFavoriteArticles(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Favorite articles updated successfully",
      });
      expect(existingUser.save).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle error if user does not exist", async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      await setFavoriteArticles(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe("removeFavoriteArticle", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response<any, Record<string, any>>;
      next = jest.fn();
      req = {
        userId: "testUserId",
        body: {
          favoriteArticle: {
            articleUrl: "https://www.google.com",
          },
        },
      } as CustomRequest;
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    it("should remove favorite articles", async () => {
      const existingUser = {
        _id: "testUserId",
        favoriteArticles: [
          {
            articleUrl: "https://www.google.com",
            favoritedAt: new Date().toISOString(),
          },
        ],
        save: jest.fn(),
      };
      (UserModel.findById as jest.Mock).mockResolvedValue(existingUser);
      await removeFavoriteArticle(req, res, next);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Favorite articles updated successfully",
      });
      expect(existingUser.save).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle error if user does not exist", async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      await removeFavoriteArticle(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe("searchNewsArticles", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response<any, Record<string, any>>;
      next = jest.fn();
      req = {
        userId: "testUserId",
        params: {
          keyword: "testKeyword",
        },
      } as any  as CustomRequest;
    });
    afterEach(() => {
      jest.resetAllMocks();
    });
    it("should return search results", async () => {
      const existingUser = {
        _id: "testUserId",
      };

      (UserModel.findById as jest.Mock).mockResolvedValue(existingUser);

      const articles = [{ title: "Article 1" }, { title: "Article 2" }];
      // @ts-ignore
      fetchNews.mockResolvedValue(articles);

      await searchNewsArticles(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        articles: articles,
        totalArticles: articles.length,
      });
      expect(fetchNews).toHaveBeenCalledWith(existingUser, req.params.keyword);
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle error if user does not exist", async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(null);
      await searchNewsArticles(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });
});
