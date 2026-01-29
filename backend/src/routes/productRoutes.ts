import express from 'express';
import { getAllProducts, createProduct, getProductByContractId, getProductById, searchProducts, deleteProduct, updateProduct, getProductsWithPagination, launchProduct } from '../controllers/productController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllProducts);
router.post('/', verifyToken, createProduct);
router.get('/search/:id', verifyToken, getProductById);
router.get('/product-contract/:id', verifyToken, getProductByContractId);
router.get('/search-name', verifyToken, searchProducts);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);
router.get('/pagination', verifyToken, getProductsWithPagination);
router.put('/launch/:type', verifyToken, launchProduct); // Função de lançamento de produto a ser implementada

export default router;  