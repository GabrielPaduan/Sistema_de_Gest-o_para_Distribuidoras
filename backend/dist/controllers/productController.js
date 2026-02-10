import express from 'express';
import * as productService from '../services/productService.js';
export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.findAllProduct();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getProductsWithPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 10;
        const { products, total } = await productService.findAllProductWithPagination(page, pageSize);
        res.status(200).json({ products, total });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createNewProduct(req.body);
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const updateProduct = await productService.updateProduct(req.body);
        res.status(201).json(updateProduct);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getProductById = async (req, res) => {
    try {
        const product = await productService.findProductById(Number(req.params.id));
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getProductByContractId = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Contract ID is required" });
        }
        const product = await productService.findProductByContractId(Number(req.params.id));
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const searchProducts = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ message: 'O termo de busca (q) é obrigatório.' });
    }
    try {
        const products = await productService.searchProductsByName(query);
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: "Erro interno no servidor ao buscar produtos." });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const productId = Number(req.params.id);
        if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        await productService.deleteProductById(productId);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const launchProduct = async (req, res) => {
    try {
        const productToLaunch = req.body;
        await productService.productLaunch(productToLaunch, Number(req.params.type));
        res.status(200).json({ message: "Product launch successful" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=productController.js.map