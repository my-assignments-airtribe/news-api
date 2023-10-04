import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { getNewsArticles } from '../controllers/newsController';

const router = express.Router();

// News Articles Route

router.get('/articles', authenticateJWT, getNewsArticles);

router.post(":id/read", (req, res) => {
  // get the id of the article
  // need to update the user model to store read article ids
  // post the id to the user's read articles
  // return the updated user model
})

router.get("/read", (req, res) => {
  // get the user's read articles
  // return the user's read articles
});

router.post(":id/favorite", (req, res) => {
  // get the id of the article
  // need to update the user model to store favorite article ids
  // post the id to the user's favorite articles
  // return the updated user model
})

router.get("/favorites", (req, res) => {
  // get the user's favorite articles
  // return the user's favorite articles
});

router.get('/search/:keyword', (req, res) => {
  // get the keyword from the params
  // search the news api for the keyword
  // return the articles
})

// Figure out how to cache the news articles and upate articles in the backround

export default router;
