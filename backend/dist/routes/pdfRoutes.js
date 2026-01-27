import express from "express";
import { createPdf, getPdfByClientId, getPdfByStatus, getPdfs, getPendentPdfByClientId, updatePdf } from "../controllers/pdfController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/", verifyToken, getPdfs);
router.get("/status/:status", verifyToken, getPdfByStatus);
router.post("/", verifyToken, createPdf);
router.put("/:id", verifyToken, updatePdf);
router.get("/client/pendentPdf/:clientId", verifyToken, getPendentPdfByClientId);
router.get("/client/:clientId", verifyToken, getPdfByClientId);
router.get("/id/:id", verifyToken, getPdfByClientId);
export default router;
//# sourceMappingURL=pdfRoutes.js.map