import express from 'express';
import { registerUser, loginUser } from '../controllers/userController'; // Import user controllers
import { getUserPreferences, setUserPreferences, removeUserPreferences } from '../controllers/userPreferencesController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { categoriesMiddleware } from '../middleware/categoriesMiddleware';
import { limiter } from '../services/rateLimiter';

const router = express.Router();

// User Registration Route
router.post('/register', limiter, registerUser);

// User Login Route
router.post('/login', limiter,  loginUser);

// User Preferences Route
router.post('/preferences', limiter, authenticateJWT, categoriesMiddleware,  setUserPreferences);

router.get('/preferences', authenticateJWT, getUserPreferences);

router.delete('/preferences', limiter, authenticateJWT, removeUserPreferences);

export default router;
