import express from 'express';
import { registerUser, loginUser } from '../controllers/userController'; // Import user controllers

const router = express.Router();

// User Registration Route
router.post('/register', registerUser);

// User Login Route
router.post('/login', loginUser);

export default router;
