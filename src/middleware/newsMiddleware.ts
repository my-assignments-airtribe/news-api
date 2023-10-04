import { Request, Response, NextFunction } from 'express';

export const setReadArticleMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let { readArticle }: { 
    readArticle: {
      articleUrl: string;
    }
  } = req.body;
  if (!readArticle) {
    return res.status(400).json({ message: "readArticle must be provided" });
  }
  if (!readArticle.articleUrl) {
    return res.status(400).json({ message: "articleUrl must be provided" });
  }
  if(!readArticle.articleUrl.startsWith("http") || !readArticle.articleUrl.startsWith("https")) {
    return res.status(400).json({ message: "articleUrl must be a valid url" });
  }
  if (readArticle.articleUrl) {
    req.body.readArticle.articleUrl = encodeURIComponent(readArticle.articleUrl.trim());
  }
  next();
}

export const setFavoriteMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { favoriteArticle }: { 
    favoriteArticle: {
      articleUrl: string;
    }
  } = req.body;
  if (!favoriteArticle) {
    return res.status(400).json({ message: "favoriteArticle must be provided" });
  }
  if (!favoriteArticle.articleUrl) {
    return res.status(400).json({ message: "articleUrl must be provided" });
  }
  if(!favoriteArticle.articleUrl.startsWith("http") || !favoriteArticle.articleUrl.startsWith("https")) {
    return res.status(400).json({ message: "articleUrl must be a valid url" });
  }
  if (favoriteArticle.articleUrl) {
    req.body.favoriteArticle.articleUrl = encodeURIComponent(favoriteArticle.articleUrl.trim());
  }
  next();
}

export const removeFavoriteMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { favoriteArticle }: { 
    favoriteArticle: {
      articleUrl: string;
    }
  } = req.body;
  if (!favoriteArticle) {
    return res.status(400).json({ message: "favoriteArticle must be provided" });
  }
  if (!favoriteArticle.articleUrl) {
    return res.status(400).json({ message: "articleUrl must be provided" });
  }
  if(!favoriteArticle.articleUrl.startsWith("http") || !favoriteArticle.articleUrl.startsWith("https")) {
    return res.status(400).json({ message: "articleUrl must be a valid url" });
  }
  if (favoriteArticle.articleUrl) {
    req.body.favoriteArticle.articleUrl = encodeURIComponent(favoriteArticle.articleUrl.trim());
  }
  next();
}

export const searchMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const keyword = req.params.keyword;
  if (!keyword) {
    return res.status(400).json({ message: "keyword must be provided" });
  }
  if (keyword && !keyword.trim()) {
    return res.status(400).json({ message: "keyword must be provided" });
  }
  if (keyword) {
    req.params.keyword = keyword.trim();
  }

  next();
}
