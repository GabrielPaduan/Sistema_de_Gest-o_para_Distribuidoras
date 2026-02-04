import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { createProductLaunch, getProductLaunchById, getProductLaunches } from '../controllers/productLaunchController.js';

const router = express.Router();

router.get('/', verifyToken, getProductLaunches);
router.post('/', verifyToken, createProductLaunch);
router.get('/:id', verifyToken, getProductLaunchById);

export default router;