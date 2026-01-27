import express from 'express';
import * as productCategoriesService from '../services/productsCategoriesService.js';
export const getAllCategories = async (req, res) => {
    try {
        const products = await productCategoriesService.findAllCategories();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createCategory = async (req, res) => {
    try {
        const newCategory = await productCategoriesService.createCategory(req.body);
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateCategory = async (req, res) => {
    try {
        const categoryID = Number(req.params.id);
        const updatedCategory = await productCategoriesService.updateCategory(categoryID, req.body);
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const categoryID = Number(req.params.id);
        await productCategoriesService.deleteCategory(categoryID);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=productsCategoriesController.js.map