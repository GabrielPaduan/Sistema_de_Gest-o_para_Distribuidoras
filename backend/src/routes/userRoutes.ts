import express from 'express';
import { createUser, login } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/', createUser);
router.post('/login', login);

export default router;