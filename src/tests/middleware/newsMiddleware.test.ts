import { Request, Response, NextFunction } from "express";
import { setFavoriteMiddleware, setReadArticleMiddleware, removeFavoriteMiddleware, getNewsArticlesMiddleware, searchMiddleware } from "../../middleware/newsMiddleware";
import UserModel from "../../models/User";
import { BadRequestError } from "../../utils/error-types";

jest.mock("../../models/User");


describe("setReadArticleMiddleware", () => {
  let res: Response<any, Record<string, any>>;
  let next: NextFunction;
  let req: any;

  beforeEach(() => {
    jest.resetAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response<any, Record<string, any>>;
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

  it("should go to the next function if the request body is invalid", async () => {
    req.body = null;

    console.error = jest.fn();
    await setReadArticleMiddleware(req, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new BadRequestError('Invalid Request'));
    
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

  it("should go to the next function  if an exception is thrown", async () => {
    (UserModel.findOne as jest.Mock).mockRejectedValue(new Error());

    await setReadArticleMiddleware(req, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error());
  });
});

describe("setFavoriteMiddleware", () => {
  let res: Response<any, Record<string, any>>;
  let next: NextFunction;
  let req: any;

  beforeEach(() => {
    jest.resetAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response<any, Record<string, any>>;
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

  it("should call next if the request body is invalid", async () => {
    req.body = null;

    console.error = jest.fn();
    await setFavoriteMiddleware(req, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new BadRequestError('Invalid Request'));
    
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

  it("should call next if an exception is thrown", async () => {
    (UserModel.findOne as jest.Mock).mockRejectedValue(new Error());

    await setFavoriteMiddleware(req, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error());
  });
});

describe("removeFavoriteMiddleware", () => {
  let res: Response<any, Record<string, any>>;
  let next: NextFunction;
  let req: any;

  beforeEach(() => {
    jest.resetAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response<any, Record<string, any>>;
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

  it("should call the next fn if the request body is invalid", async () => {
    req.body = null;

    console.error = jest.fn();
    await removeFavoriteMiddleware(req, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new BadRequestError('Invalid Request'));
    
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
    (UserModel.findOne as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({
        favoriteArticles: [
          {
            articleUrl: "https://test-example.com",
          },
        ],
      }),
    }));
  
    // Call the removeFavoriteMiddleware function
    await removeFavoriteMiddleware(req, res as Response, next);
  
    // Encode the expected articleUrl value
    const expectedEncodedUrl = encodeURIComponent("https://test-example.com");
  
    // Make the expect assertions
    expect(req.body.favoriteArticle.articleUrl).toEqual(expectedEncodedUrl);
    expect(next).toHaveBeenCalled();
  });

  it("should return article not found if no article", async () => {
    // Mock the UserModel.findOne method
    (UserModel.find as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(null),
    }));
  
    // Call the removeFavoriteMiddleware function
    await removeFavoriteMiddleware(req, res as Response, next);

    
  
    // Make the expect assertions
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Article not found in favorite",
    });
  });

  it("should call the next fn if an exception is thrown", async () => {
    (UserModel.findOne as jest.Mock).mockRejectedValue(new Error());

    await removeFavoriteMiddleware(req, res as Response, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error());
  });
});

describe("getNewsArticlesMiddleware", () => {
  let res: Response<any, Record<string, any>>;
  let next: NextFunction;
  let req: any;

  beforeEach(() => {
    req = { userId: "123" };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response<any, Record<string, any>>;
    next = jest.fn();
  });

  it("should return a 400 error if the user does not exist", async () => {
    jest.spyOn(UserModel, "findById").mockResolvedValue(null);

    await getNewsArticlesMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User does not exist" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return a 400 error if the user preferences are not set", async () => {
    const user = { preferences: {} };
    jest.spyOn(UserModel, "findById").mockResolvedValue(user);

    await getNewsArticlesMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message:
        "Required parameters are missing, the scope of your search is too broad. Please set any of the following required parameters and try again: sources, q, language, country, category.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call the next middleware if the user preferences are set", async () => {
    const user = { preferences: { categories: ["sports"], sources: ["cnn"] } };
    jest.spyOn(UserModel, "findById").mockResolvedValue(user);

    await getNewsArticlesMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe("searchMiddleware", () => {
  let req: Request;
  let res: Response<any, Record<string, any>>;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response<any, Record<string, any>>;
    next = jest.fn();
  });

  it("should call next() if keyword is provided", () => {
    req.params = { keyword: "example" };

    searchMiddleware(req, res, next);

    expect(next).toBeCalled();
  });

  it("should trim the keyword if it is provided", () => {
    req.params = { keyword: "  example  " };

    searchMiddleware(req, res, next);

    expect(req.params.keyword).toBe("example");
  });

  it("should return a 400 response if keyword is not provided", () => {
    req.params = {};

    searchMiddleware(req, res, next);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({ message: "keyword must be provided" });
  });

  it("should return a 400 response if keyword is empty after trimming", () => {
    req.params = { keyword: "  " };

    searchMiddleware(req, res, next);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({ message: "keyword must be provided" });
  });
});
