import express from 'express';
import { registerUser, loginUser } from '../controllers/userController'; // Import user controllers
import { getUserPreferences, setUserPreferences, removeUserPreferences } from '../controllers/userPreferencesController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { categoriesMiddleware } from '../middleware/categoriesMiddleware';

const router = express.Router();

// User Registration Route
router.post('/register', registerUser);

// User Login Route
router.post('/login', loginUser);

// User Preferences Route
router.post('/preferences', authenticateJWT, categoriesMiddleware,  setUserPreferences);

router.get('/preferences', authenticateJWT, getUserPreferences);

router.delete('/preferences', authenticateJWT, removeUserPreferences);

export default router;
