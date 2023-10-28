import request from "supertest";
import app from "../app";

describe("GET /", () => {
  it("should return 200 OK with a message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("This is the News API");
  });
  app.close();
});