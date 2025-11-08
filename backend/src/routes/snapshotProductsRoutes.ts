import express from "express"
import { createPdf, getPdfByClientId, getPdfs, updatePdf } from "../controllers/pdfController.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { createSnapshotProductController } from "../controllers/snapshotProductsController.js";

const router = express.Router()

// router.get("/", verifyToken, getPdfs);
router.post("/", verifyToken, createSnapshotProductController);
// router.put("/:id", verifyToken, updatePdf);
// router.get("/client/:clientId", verifyToken, getPdfByClientId);

export default router;