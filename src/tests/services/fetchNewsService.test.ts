import { fetchNews } from "../../services/fetchNewsService";
import axios from "axios";
import { IUser } from "../../models/User";

jest.mock("axios");

describe.only("fetchNews", () => {
  const user = {
    username: "testUser",
    email: "testUser@test.com",
    password: "testPassword",
    createdAt: new Date(),
    updatedAt: new Date(),
    preferences: {
      categories: ["business", "technology"],
      sources: ["cnn", "bbc-news"],
    },
  } as IUser;

  const apiKey = "test-api-key";
  const newsApiUrl = "https://test-news-api.com";

  beforeAll(() => {
    process.env.NEWS_API_SECRET = apiKey;
    process.env.NEWS_API_URL = newsApiUrl;
  });

  afterAll(() => {
    delete process.env.NEWS_API_SECRET;
    delete process.env.NEWS_API_URL;
  });

  afterEach(() => {
    jest.resetAllMocks();
    (axios.get as jest.Mock).mockClear();
  });

  it("should fetch news based on user preferences", async () => {
    const expectedArticles = [
      { title: "Article 1", source: { id: "cnn" } },
      { title: "Article 2", source: { id: "bbc-news" } },
      { title: "Article 3", source: { id: "cnn" } },
      { title: "Article 4", source: { id: "bbc-news" } },
    ];

    const axiosResponse1 = {
      data: { articles: expectedArticles.slice(0, 2) },
    };
    const axiosResponse2 = {
      data: { articles: expectedArticles.slice(2) },
    };

    (axios.get as jest.Mock).mockImplementation((url, config) => {
      if (config.params.category) {
        return Promise.resolve(axiosResponse1);
      } else {
        return Promise.resolve(axiosResponse2);
      }
    });

    const articles = await fetchNews(user);

    expect(axios.get).toHaveBeenCalledTimes(3);
    expect(axios.get).toHaveBeenCalledWith(`${newsApiUrl}/top-headlines`, {
      params: {
        apiKey,
        category: "business",
        page: 1,
        pageSize: 10,
      },
    });
    expect(axios.get).toHaveBeenCalledWith(`${newsApiUrl}/top-headlines`, {
      params: {
        apiKey,
        category: "technology",
        page: 1,
        pageSize: 10,
      },
    });
    expect(axios.get).toHaveBeenCalledWith(`${newsApiUrl}/top-headlines`, {
      params: {
        apiKey,
        sources: "cnn,bbc-news",
        page: 1,
        pageSize: 10,
      },
    });
    expect([...new Set(articles)]).toHaveLength(4);
    expect([...new Set(articles)]).toEqual(expectedArticles);
  });

  it("should throw an error if any request fails", async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error("Test error"));
    console.error = jest.fn();

    await expect(fetchNews(user)).rejects.toThrow("Test error");
  });

  it("should throw an error if environment variables are missing", async () => {
    delete process.env.NEWS_API_SECRET;

    await expect(fetchNews(user)).rejects.toThrow(
      "Missing environment variables."
    );
  });
});
