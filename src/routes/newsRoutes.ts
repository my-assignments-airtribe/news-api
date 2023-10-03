import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { getNewsArticles } from '../controllers/newsController';

const router = express.Router();

// News Articles Route

router.get('/articles', authenticateJWT, getNewsArticles);

export default router;
