import express from 'express';
import * as productService from '../services/productService.js';

export const getAllProducts = async (req: express.Request, res: express.Response) => {
    try {
        const products = await productService.findAllProduct();
        res.status(200).json(products);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductsWithPagination = async (req: express.Request, res: express.Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const { products, total } = await productService.findAllProductWithPagination(page, pageSize);
        res.status(200).json({ products, total });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createProduct = async (req: express.Request, res: express.Response) => {
    try {
        const newProduct = await productService.createNewProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req: express.Request, res: express.Response) => {
    try {
        const updateProduct = await productService.updateProduct(req.body);
        res.status(201).json(updateProduct)       
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

export const getProductById = async (req: express.Request, res: express.Response) => {
    try {
        const product = await productService.findProductById(Number(req.params.id));
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductByContractId = async (req: express.Request, res: express.Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Contract ID is required" });
        }
        const product = await productService.findProductByContractId(Number(req.params.id));
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const searchProducts = async (req: express.Request, res: express.Response) => {
    const query = req.query.q as string;

    if (!query) {
        return res.status(400).json({ message: 'O termo de busca (q) é obrigatório.' });
    }

    try {
        const products = await productService.searchProductsByName(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Erro interno no servidor ao buscar produtos." });
    }
};

export const deleteProduct = async (req: express.Request, res: express.Response) => {
    try {
        const productId = Number(req.params.id);
        if (isNaN(productId)) {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        await productService.deleteProductById(productId);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const launchProduct = async (req: express.Request, res: express.Response) => {
    try {
        const productToLaunch = req.body;
        await productService.productLaunch(productToLaunch, Number(req.params.type));
        res.status(200).json({ message: "Product launch successful" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
