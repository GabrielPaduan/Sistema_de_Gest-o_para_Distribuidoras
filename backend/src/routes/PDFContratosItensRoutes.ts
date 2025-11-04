import express from "express"
import { createPdf, getPdfByClientId, getPdfs, updatePdf } from "../controllers/pdfController.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router()

// router.get("/", verifyToken, getPdfs);
// router.post("/", verifyToken, createPdf);
// router.put("/:id", verifyToken, updatePdf);
// router.get("/client/:clientId", verifyToken, getPdfByClientId);

export default router;