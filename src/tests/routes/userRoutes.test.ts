import request from "supertest";
import mongoose, { ConnectOptions } from "mongoose";
import app from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import UserModel from "../../models/User";

let mongoServer: MongoMemoryServer;
let accessToken: string;

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

afterAll(async () => {
  await UserModel.deleteMany({});
  await mongoose.connection.close();
  await mongoServer.stop();
  app.close();
  accessToken = "";
});

describe("User Routes", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/user/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });
    expect(response.status).toBe(201);

    const user = await UserModel.findOne({ username: "testuser" });
    // verfiy the user
    await UserModel.findOneAndUpdate(
      { username: "testuser" },
      { emailVerified: true }
    );
    expect(user).toBeTruthy();
    expect(user?.username).toBe("testuser");
    expect(user?.email).toBe("testuser@example.com");
  });

  it("should return a 400 error if the username is already taken", async () => {
    const res = await request(app)
      .post("/user/register")
      .send({
        username: "testuser",
      email: "testuser@example.com",
      password: "password123",
      })
      .expect(400);

    expect(res.body.message).toBe("Username is already taken");
  });

  it("should login an existing user", async () => {
    

    const loginResponse = await request(app).post("/user/login").send({
      username: "testuser",
      password: "password123",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty("accessToken");
    accessToken = loginResponse.body.accessToken;
  });

  it("should set user preferences", async () => {
    const response = await request(app)
      .post("/user/preferences")
      .set("Authorization", accessToken)
      .send({
        categories: ["business", "technology"],
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Preferences updated successfully"
    );
  });

  it("should get user preferences", async () => {
    const response = await request(app)
      .get("/user/preferences")
      .set("Authorization", accessToken);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("preferences", {
      categories: ["business", "technology"],
      sources: [],
    });
  });

  it("should remove user preferences", async () => {
    const response = await request(app)
      .delete("/user/preferences")
      .set("Authorization", accessToken);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Preferences updated successfully"
    );
  });
});
