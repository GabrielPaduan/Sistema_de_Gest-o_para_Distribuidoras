import * as pdfService from "../services/pdfService.js"
import express from "express"

export const getPdfs = async (req: express.Request, res: express.Response) => {
  try {
    const pdfs = await pdfService.getAllPdfs();
    res.status(200).json(pdfs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPdfByStatus = async (req: express.Request, res: express.Response) => {
  try {
    const status = Number(req.params.status);
    if (isNaN(status) || status !== 0 && status !== 1) {
      return res.status(400).json({ error: "Invalid status parameter" });
    } 
    const pdfs = await pdfService.getPdfByStatus(status);
    res.status(200).json(pdfs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const createPdf = async (req: express.Request, res: express.Response) => {
  try {
    const newPdf = await pdfService.createPdf(req.body);
    res.status(201).json(newPdf);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePdf = async (req: express.Request, res: express.Response) => {
  try {
    const { PDF_Client_Id, PDF_Status, PDF_Generated_Date, PDF_Observacoes } = req.body;
    const updatedPdf = await pdfService.updatePdf(
      Number(req.params.id),
      PDF_Client_Id,
      PDF_Status,
      PDF_Generated_Date,
      PDF_Observacoes
    );
    res.status(200).json(updatedPdf);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPendentPdfByClientId = async (req: express.Request, res: express.Response) => {
  try {
    const pdf = await pdfService.getPendentPdfByClientId(Number(req.params.clientId));
    res.status(200).json(pdf);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPdfByClientId = async (req: express.Request, res: express.Response) => {
  try {
    const pdf = await pdfService.getPdfByClientId(Number(req.params.clientId));
    res.status(200).json(pdf);
  }
  catch (error: any) {
    res.status(500).json({ error: error.message });
  } 
};