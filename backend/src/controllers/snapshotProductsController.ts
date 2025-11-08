import express from 'express';
import { createSnapshotProduct } from '../services/snapshotProductsService.js';

export const createSnapshotProductController = async (req: express.Request, res: express.Response) => {
    try {
        const snapshotData = req.body;
        delete snapshotData.ID_ContPDFItens; // Ensure ID is not included for insertion
        const newSnapshotProduct = await createSnapshotProduct(snapshotData);
        res.status(201).json(newSnapshotProduct);
    } catch (error) {
        console.error("Error in createSnapshotProduct controller:", error);
        res.status(500).json({ error: "Error creating snapshot product" });
    }
};