import express from "express";
import { authenticateJWT } from "../middleware/authMiddleware";
import {
  getFavoriteArticles,
  getNewsArticles,
  getReadArticles,
  removeFavoriteArticle,
  searchNewsArticles,
  setFavoriteArticles,
  setReadArticles,
} from "../controllers/newsController";
import {
  removeFavoriteMiddleware,
  searchMiddleware,
  setFavoriteMiddleware,
  setReadArticleMiddleware,
} from "../middleware/newsMiddleware";

const router = express.Router();

// News Articles Route

router.get("/articles", authenticateJWT, getNewsArticles);

router.post("/read", authenticateJWT, setReadArticleMiddleware, setReadArticles);

router.get("/read", authenticateJWT, getReadArticles);

router.post("/favorite", authenticateJWT, setFavoriteMiddleware, setFavoriteArticles);

router.get("/favorites", authenticateJWT, getFavoriteArticles);

router.delete("/favorite", authenticateJWT, removeFavoriteMiddleware, removeFavoriteArticle);

router.get("/search/:keyword", authenticateJWT, searchMiddleware, searchNewsArticles);

// Figure out how to cache the news articles and upate articles in the backround

export default router;
