import express from 'express';
import { createSnapshotProduct, deleteSnapshotProduct, getSnapshotProductsByPdfId } from '../services/snapshotProductsService.js';
export const createSnapshotProductController = async (req, res) => {
    try {
        const snapshotData = req.body;
        delete snapshotData.ID_ContPDFItens; // Ensure ID is not included for insertion
        const newSnapshotProduct = await createSnapshotProduct(snapshotData);
        res.status(201).json(newSnapshotProduct);
    }
    catch (error) {
        console.error("Error in createSnapshotProduct controller:", error);
        res.status(500).json({ error: "Error creating snapshot product" });
    }
};
export const getSnapshotProductsByPdfIdController = async (req, res) => {
    try {
        const pdfId = req.params.pdfId;
        if (!pdfId) {
            return res.status(400).json({ error: "pdfId parameter is required" });
        }
        const snapshotProducts = await getSnapshotProductsByPdfId(parseInt(pdfId));
        res.status(200).json(snapshotProducts);
    }
    catch (error) {
        console.error("Error in getSnapshotProductsByPdfId controller:", error);
        res.status(500).json({ error: "Error fetching snapshot products" });
    }
};
export const deleteSnapshotProductController = async (req, res) => {
    try {
        const snapshotId = req.params.snapshotId;
        if (!snapshotId) {
            return res.status(400).json({ error: "snapshotId parameter is required" });
        }
        await deleteSnapshotProduct(parseInt(snapshotId));
        res.status(204).send();
    }
    catch (error) {
        console.error("Error in deleteSnapshotProduct controller:", error);
        res.status(500).json({ error: "Error deleting snapshot product" });
    }
};
//# sourceMappingURL=snapshotProductsController.js.map