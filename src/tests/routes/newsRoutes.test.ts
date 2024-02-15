import request from "supertest";
import mongoose, { ConnectOptions } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../app";
import UserModel from "../../models/User";
import User from "../../models/User";

let mongoServer: MongoMemoryServer;
let accessToken: string;
let userId: string;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  await mongoServer.start(); // Use start to initiate the MongoDB server
  const mongoUri = mongoServer.getUri(); // Get the URI after starting
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions;
  await mongoose.connect(mongoUri, mongooseOptions);
  // Register a new user
  await request(app).post("/user/register").send({
    username: "testusernews",
    email: "testusernews@example.com",
    password: "password123",
    token: "token",
  });
  // Verify the new user

  await UserModel.findOneAndUpdate(
    { username: "testusernews" },
    { emailVerified: true }
  )

  // Login the new user
  const response = await request(app).post("/user/login").send({
    username: "testusernews",
    password: "password123",
  });
  accessToken = response.body.accessToken;
  userId = response.body.userId;
});

afterAll(async () => {
  await UserModel.deleteMany({});
  await mongoose.connection.close();
  await mongoServer.stop();
  app.close();
  accessToken = "";
});

describe("News Routes", () => {
  describe("GET /articles", () => {
    it("should return a list of news articles", async () => {
      const response = await request(app)
        .get("/news/articles")
        .set("Authorization", `${accessToken}`);
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body.articles).toEqual([]);
      expect(response.body.totalArticles).toEqual(0);
    });
  });

  describe("POST /read", () => {
    it("should mark a news article as read", async () => {
      const response = await request(app)
        .post("/news/read")
        .send({
          readArticle: { articleUrl: "https://www.example.com" },
          userId,
        })
        .set("Authorization", `${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: "Read articles updated successfully",
        })
      );
    });
  });

  describe("GET /read", () => {
    it("should return a list of read news articles", async () => {
      const response = await request(app)
        .get("/news/read")
        .set("Authorization", `${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.readArticles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            articleUrl: expect.any(String),
            readAt: expect.any(String),
          }),
        ])
      );
    });
  });

  describe("POST /favorite", () => {
    it("should mark a news article as favorite", async () => {
      const response = await request(app).post("/news/favorite").send({
        favoriteArticle: { articleUrl: "https://www.example.com" },
        userId,
      })
      .set("Authorization", `${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ message: "Favorite articles updated successfully" }));
    });
  });

  describe("GET /favorites", () => {
    it("should return a list of favorite news articles", async () => {
      await request(app).post("/news/favorite").send({
        favoriteArticle: { articleUrl: "https://www.example2.com" },
        userId,
      }).set("Authorization", `${accessToken}`);
      const response = await request(app).get("/news/favorites").set("Authorization", `${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body.favoriteArticles).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            articleUrl: expect.any(String),
            favoritedAt: expect.any(String),
          }),
        ])
      );
    });
  });

  describe("DELETE /favorite", () => {
    it("should remove a news article from favorites", async () => {
      await request(app).post("/news/favorite").send({
        favoriteArticle: { articleUrl: "https://www.example3.com" },
        userId,
      }).set("Authorization", `${accessToken}`);
      const response = await request(app).delete("/news/favorite")
      .send({
        favoriteArticle: { articleUrl: "https://www.example3.com" },
        userId,
      })
      .set("Authorization", `${accessToken}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ message: "Favorite articles updated successfully" }));
    });
  });

  describe("GET /search/:keyword", () => {
    it("should return a list of news articles matching the search keyword", async () => {
      const response = await request(app).get("/news/search/test").set("Authorization", `${accessToken}`);
      expect(response.status).toBe(200);
    });
  });
});
