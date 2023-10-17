import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { ConnectOptions } from "mongoose";
import app from "../../app";
import UserModel from "../../models/User";
import { generateToken } from "../../services/authService";
import { getCache, setCache } from "../../services/cacheServie";

let mongoServer: MongoMemoryServer;
beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  await mongoServer.start(); // Use start to initiate the MongoDB server
  const mongoUri = mongoServer.getUri(); // Get the URI after starting
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions;
  await mongoose.connect(mongoUri, mongooseOptions);
});

afterEach(async () => {
  // Clear the UserModel collection after each test
  await UserModel.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
  app.close();
});

describe("newsController", () => {
  let user: any;
  let auth_token: string;

  beforeEach(async () => {
    user = new UserModel({
      username: "test",
      password: "testPassword",
      email: "test@example.com",
      preferences: {
        category: "business",
      },
    });
    await user.save();
    auth_token = await generateToken(user._id);
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  jest.mock("../../services/cacheServie", () => ({
    getCache: jest.fn(),
  }));

  describe("getNewsArticles", () => {
    it("should return 200 and an array of articles", async () => {
      const response = await request(app)
        .get("/news/articles")
        .set("Authorization", `${auth_token}`)
        .expect(200);

      expect(response.body.articles).toBeDefined();
      expect(Array.isArray(response.body.articles)).toBe(true);
    });

    it("should throw unauthorized if no token", async () => {
      const response = await request(app)
        .get("/news/articles")
        .expect(403);

      expect(response.body.message).toBe("Unauthorized");
    });

    it("should return 400 if user does not exist", async () => {
      await UserModel.deleteMany({});
      const response = await request(app)
        .get("/news/articles")
        .set("Authorization", `${auth_token}`)
        .expect(400);

      expect(response.body.message).toBe("User does not exist");
      // expect BadRequestError to be thrown
      expect
    });

    it("should return 404 if the endpoint is not found", async () => {
      const response = await request(app)
        .get("/news/nonexistent")
        .set("Authorization", `${auth_token}`)
        .expect(404);
    
      expect(response.body.message).toBe(undefined);
    });
  });

  describe("getReadArticles", () => {
    it("should return 200 and an array of read articles", async () => {
      user.readArticles = [
        {
          articleUrl: "https://example.com/article1",
          readAt: new Date(),
        },
        {
          articleUrl: "https://example.com/article2",
          readAt: new Date(),
        },
      ];
      await user.save();

      const response = await request(app)
        .get("/news/read")
        .set("Authorization", `${auth_token}`)
        .expect(200);

      expect(response.body.readArticles).toBeDefined();
      expect(Array.isArray(response.body.readArticles)).toBe(true);
      expect(response.body.readArticles.length).toBe(2);
    });

    it("should return 400 if user does not exist", async () => {
      await UserModel.deleteMany({});
      const response = await request(app)
        .get("/news/read")
        .set("Authorization", `${auth_token}`)
        .expect(400);

      expect(response.body.message).toBe("User does not exist");
    });
  });

  describe("setReadArticles", () => {
    it("should return 200 and update the user's read articles", async () => {
      const article = {
        articleUrl: "https://example.com/article1",
        title: "Article 1",
        description: "This is article 1",
        imageUrl: "https://example.com/article1.jpg",
      };

      const response = await request(app)
        .post("/news/read")
        .set("Authorization", `${auth_token}`)
        .send({ readArticle: article })
        .expect(200);

      expect(response.body.message).toBe("Read articles updated successfully");
      const updatedUser = await UserModel.findById(user._id);
      expect(updatedUser?.readArticles.length).toBe(1);
      expect(updatedUser?.readArticles[0].articleUrl).toBe(encodeURIComponent(article.articleUrl));
    });

    it("should return 400 if user does not exist", async () => {
      await UserModel.deleteMany({});
      const article = {
        articleUrl: "https://example.com/article1",
        title: "Article 1",
        description: "This is article 1",
        imageUrl: "https://example.com/article1.jpg",
      };

      const response = await request(app)
        .post("/news/read")
        .set("Authorization", `${auth_token}`)
        .send({ readArticle: article })
        .expect(400);

      expect(response.body.message).toBe("User does not exist");
    });
  });

  describe("getFavoriteArticles", () => {
    it("should return 200 and an array of favorite articles", async () => {
      user.favoriteArticles = [
        {
          articleUrl: "https://example.com/article1",
          favoritedAt: new Date(),
        },
        {
          articleUrl: "https://example.com/article2",
          favoritedAt: new Date(),
        },
      ];
      await user.save();

      const response = await request(app)
        .get("/news/favorites")
        .set("Authorization", `${auth_token}`)
        .expect(200);

      expect(response.body.favoriteArticles).toBeDefined();
      expect(Array.isArray(response.body.favoriteArticles)).toBe(true);
      expect(response.body.favoriteArticles.length).toBe(2);
    });

    it("should return 400 if user does not exist", async () => {
      await UserModel.deleteMany({});
      const response = await request(app)
        .get("/news/favorites")
        .set("Authorization", `${auth_token}`)
        .expect(400);

      expect(response.body.message).toBe("User does not exist");
    });
  });

  describe("setFavoriteArticles", () => {
    it("should return 200 and update the user's favorite articles", async () => {
      const article = {
        articleUrl: "https://example.com/article1",
      };

      const response = await request(app)
        .post("/news/favorite")
        .set("Authorization", `${auth_token}`)
        .send({ favoriteArticle: article })
        .expect(200);

      expect(response.body.message).toBe("Favorite articles updated successfully");
      const updatedUser = await UserModel.findById(user._id);
      expect(updatedUser?.favoriteArticles.length).toBe(1);
      expect(updatedUser?.favoriteArticles[0].articleUrl).toBe(encodeURIComponent(article.articleUrl));
    });

    it("should return 400 if user does not exist", async () => {
      await UserModel.deleteMany({});
      const article = {
        articleUrl: "https://example.com/article1",
      };

      const response = await request(app)
        .post("/news/favorite")
        .set("Authorization", `${auth_token}`)
        .send({ favoriteArticle: article })
        .expect(400);

      expect(response.body.message).toBe("User does not exist");
    });
  });

  describe("removeFavoriteArticle", () => {
    it("should return 200 and remove the specified favorite article", async () => {
      user.favoriteArticles = [
        {
          articleUrl: "https://example.com/article1",
          favoritedAt: new Date(),
        },
        {
          articleUrl: "https://example.com/article2",
          favoritedAt: new Date(),
        },
      ];
      await user.save();

      const articleToRemove = {
        articleUrl: "https://example.com/article1",
      };

      const response = await request(app)
        .delete("/news/favorite")
        .set("Authorization", `${auth_token}`)
        .send({ favoriteArticle: articleToRemove })
        .expect(200);

      expect(response.body.message).toBe("Favorite articles updated successfully");
      const updatedUser = await UserModel.findById(user._id);
      expect(updatedUser?.favoriteArticles.length).toBe(1);
      expect(updatedUser?.favoriteArticles[0].articleUrl).toBe("https://example.com/article2");
    });

    it("should return 400 if user does not exist", async () => {
      await UserModel.deleteMany({});
      const articleToRemove = {
        articleUrl: "https://example.com/article1",
      };

      const response = await request(app)
        .delete("/news/favorite")
        .set("Authorization", `${auth_token}`)
        .send({ favoriteArticle: articleToRemove })
        .expect(400);

      expect(response.body.message).toBe("User does not exist");
    });
  });

  describe("searchNewsArticles", () => {
    it("should return 200 and an array of articles matching the keyword", async () => {
      const response = await request(app)
        .get("/news/search/business")
        .set("Authorization", `${auth_token}`)
        .expect(200);

      expect(response.body.articles).toBeDefined();
      expect(Array.isArray(response.body.articles)).toBe(true);
    });

    it("should return 400 if user does not exist", async () => {
      await UserModel.deleteMany({});
      const response = await request(app)
        .get("/news/search/business")
        .set("Authorization", `${auth_token}`)
        .expect(400);

      expect(response.body.message).toBe("User does not exist");
    });
  });
});