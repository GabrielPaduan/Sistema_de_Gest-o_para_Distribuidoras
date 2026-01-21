import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../controllers/productsCategoriesController.js';

const router = express.Router();

router.get('/', verifyToken, getAllCategories);
router.post('/', verifyToken, createCategory);
router.put('/:id', verifyToken, updateCategory);
router.delete('/:id', verifyToken, deleteCategory);

export default router;  