import request from "supertest";
import { Response, NextFunction } from "express";
import { setFavoriteMiddleware, setReadArticleMiddleware, removeFavoriteMiddleware } from "../../middleware/newsMiddleware";
import UserModel from "../../models/User";
import { BadRequestError } from "../../utils/error-types";

jest.mock("../../models/User");


describe("setReadArticleMiddleware", () => {
  let res: Partial<Response>;
  let next: NextFunction;
  let req: any;

  beforeEach(() => {
    jest.resetAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    req = {
      body: {
        readArticle: {
          articleUrl: "https://test-example.com",
        },
      },
      userId: "user-id",
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    req = {};
  });

  it("should call next if the request is valid", async () => {
    (UserModel.find as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(null),
    }));

    await setReadArticleMiddleware(req, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return an error if the request body is invalid", async () => {
    req.body = null;

    console.error = jest.fn();
    await setReadArticleMiddleware(req, res as Response, next);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
    });
    
  });

  it("should return an error if readArticle is not provided", async () => {
    req.body.readArticle = null;

    await setReadArticleMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "readArticle must be provided",
    });
  });

  it("should return an error if articleUrl is not provided", async () => {
    req.body.readArticle.articleUrl = null;

    await setReadArticleMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "articleUrl must be provided",
    });
  });

  it("should return an error if articleUrl is not a valid url", async () => {
    req.body.readArticle.articleUrl = "invalid-url";

    await setReadArticleMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "articleUrl must be a valid url",
    });
  });

  it("should return an error if the article is already read", async () => {
    (UserModel.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({
        readArticles: [
          {
            articleUrl: "https://test-example.com",
          },
        ],
      }),
    }));

    await setReadArticleMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Article already read",
    });
  });

  it("should encode the articleUrl before calling next", async () => {
    // Mock the UserModel.findOne method
    (UserModel.find as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(null),
    }));
  
    // Call the setReadArticleMiddleware function
    await setReadArticleMiddleware(req, res as Response, next);
  
    // Encode the expected articleUrl value
    const expectedEncodedUrl = encodeURIComponent("https://test-example.com");
  
    // Make the expect assertions
    expect(req.body.readArticle.articleUrl).toEqual(expectedEncodedUrl);
    expect(next).toHaveBeenCalled();
  });

  it("should return a server error if an exception is thrown", async () => {
    (UserModel.findOne as jest.Mock).mockRejectedValue(new Error());

    await setReadArticleMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
    });
  });
});

describe("setFavoriteMiddleware", () => {
  let res: Partial<Response>;
  let next: NextFunction;
  let req: any;

  beforeEach(() => {
    jest.resetAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    req = {
      body: {
        favoriteArticle: {
          articleUrl: "https://test-example.com",
        },
      },
      userId: "user-id",
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    req = {};
  });

  it("should call next if the request is valid", async () => {
    (UserModel.find as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(null),
    }));

    await setFavoriteMiddleware(req, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return an error if the request body is invalid", async () => {
    req.body = null;

    console.error = jest.fn();
    await setFavoriteMiddleware(req, res as Response, next);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
    });
    
  });

  it("should return an error if favoriteArticle is not provided", async () => {
    req.body.favoriteArticle = null;

    await setFavoriteMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "favoriteArticle must be provided",
    });
  });

  it("should return an error if articleUrl is not provided", async () => {
    req.body.favoriteArticle.articleUrl = null;

    await setFavoriteMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "articleUrl must be provided",
    });
  });

  it("should return an error if articleUrl is not a valid url", async () => {
    req.body.favoriteArticle.articleUrl = "invalid-url";

    await setFavoriteMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "articleUrl must be a valid url",
    });
  });

  it("should return an error if the article is already added to favorites", async () => {
    (UserModel.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({
        favoriteArticles: [
          {
            articleUrl: "https://test-example.com",
          },
        ],
      }),
    }));

    await setFavoriteMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Article already added to Favorites",
    });
  });

  it("should encode the articleUrl before calling next", async () => {
    // Mock the UserModel.findOne method
    (UserModel.find as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(null),
    }));
  
    // Call the setFavoriteMiddleware function
    await setFavoriteMiddleware(req, res as Response, next);
  
    // Encode the expected articleUrl value
    const expectedEncodedUrl = encodeURIComponent("https://test-example.com");
  
    // Make the expect assertions
    expect(req.body.favoriteArticle.articleUrl).toEqual(expectedEncodedUrl);
    expect(next).toHaveBeenCalled();
  });

  it("should return a server error if an exception is thrown", async () => {
    (UserModel.findOne as jest.Mock).mockRejectedValue(new Error());

    await setFavoriteMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
    });
  });
});

describe("removeFavoriteMiddleware", () => {
  let res: Partial<Response>;
  let next: NextFunction;
  let req: any;

  beforeEach(() => {
    jest.resetAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    req = {
      body: {
        favoriteArticle: {
          articleUrl: "https://test-example.com",
        },
      },
      userId: "user-id",
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
    req = {};
  });

  it("should call next if the request is valid", async () => {
    (UserModel.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(null),
    }));

    await removeFavoriteMiddleware(req, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it("should return an error if the request body is invalid", async () => {
    req.body = null;

    console.error = jest.fn();
    await removeFavoriteMiddleware(req, res as Response, next);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
    });
    
  });

  it("should return an error if favoriteArticle is not provided", async () => {
    req.body.favoriteArticle = null;

    await removeFavoriteMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "favoriteArticle must be provided",
    });
  });

  it("should return an error if articleUrl is not provided", async () => {
    req.body.favoriteArticle.articleUrl = null;

    await removeFavoriteMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "articleUrl must be provided",
    });
  });

  it("should return an error if articleUrl is not a valid url", async () => {
    req.body.favoriteArticle.articleUrl = "invalid-url";

    await removeFavoriteMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "articleUrl must be a valid url",
    });
  });

  it("should encode the articleUrl before calling next", async () => {
    // Mock the UserModel.findOne method
    (UserModel.find as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(null),
    }));
  
    // Call the removeFavoriteMiddleware function
    await removeFavoriteMiddleware(req, res as Response, next);
  
    // Encode the expected articleUrl value
    const expectedEncodedUrl = encodeURIComponent("https://test-example.com");
  
    // Make the expect assertions
    expect(req.body.favoriteArticle.articleUrl).toEqual(expectedEncodedUrl);
    expect(next).toHaveBeenCalled();
  });

  it("should return a server error if an exception is thrown", async () => {
    (UserModel.findOne as jest.Mock).mockRejectedValue(new Error());

    await removeFavoriteMiddleware(req, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
    });
  });
});