import * as pdfService from "../services/pdfService.js";
import express from "express";
export const getPdfs = async (req, res) => {
    try {
        const pdfs = await pdfService.getAllPdfs();
        res.status(200).json(pdfs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getPdfByStatus = async (req, res) => {
    try {
        const status = Number(req.params.status);
        if (isNaN(status) || status !== 0 && status !== 1) {
            return res.status(400).json({ error: "Invalid status parameter" });
        }
        const pdfs = await pdfService.getPdfByStatus(status);
        res.status(200).json(pdfs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getPdfById = async (req, res) => {
    try {
        const id = Number(req.params.status);
        if (isNaN(id) || id !== 0 && id !== 1) {
            return res.status(400).json({ error: "Invalid id parameter" });
        }
        const pdfs = await pdfService.getPdfById(id);
        res.status(200).json(pdfs);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createPdf = async (req, res) => {
    try {
        const newPdf = await pdfService.createPdf(req.body);
        res.status(201).json(newPdf);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updatePdf = async (req, res) => {
    try {
        const { PDF_Client_Id, PDF_Status, PDF_Generated_Date, PDF_Observacoes, PDF_Valor, PDF_ValorPago } = req.body;
        const updatedPdf = await pdfService.updatePdf(Number(req.params.id), PDF_Client_Id, PDF_Status, PDF_Generated_Date, PDF_Observacoes, PDF_Valor, PDF_ValorPago);
        res.status(200).json(updatedPdf);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getPendentPdfByClientId = async (req, res) => {
    try {
        const pdf = await pdfService.getPendentPdfByClientId(Number(req.params.clientId));
        res.status(200).json(pdf);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getPdfByClientId = async (req, res) => {
    try {
        const pdf = await pdfService.getPdfByClientId(Number(req.params.clientId));
        res.status(200).json(pdf);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deletePdf = async (req, res) => {
    try {
        await pdfService.deletePdf(Number(req.params.id));
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=pdfController.js.map