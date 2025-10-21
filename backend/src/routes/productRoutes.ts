import express from 'express';
import { getAllProducts, createProduct, getProductByContractId, getProductById, searchProducts, deleteProduct, updateProduct } from '../controllers/productController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllProducts);
router.post('/', verifyToken, createProduct);
router.get('/search/:id', verifyToken, getProductById);
router.get('/product-contract/:id', verifyToken, getProductByContractId);
router.get('/search-name', verifyToken, searchProducts);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);

export default router;