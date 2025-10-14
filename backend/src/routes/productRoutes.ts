import express from 'express';
import { getAllProducts, createProduct, getProductByContractId, getProductById, searchProducts, deleteProduct, updateProduct } from '../controllers/productController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getAllProducts);
router.post('/', createProduct);
router.get('/search/:id', getProductById);
router.get('/product-contract/:id', getProductByContractId);
router.get('/search-name', searchProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;