import express from 'express';
import { registerUser } from '../controllers/userController'; // Import user controllers

const router = express.Router();

// User Registration Route
router.post('/register', registerUser);


export default router;
