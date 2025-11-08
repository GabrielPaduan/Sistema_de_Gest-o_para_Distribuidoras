import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js";
import { createSnapshotProductController, getSnapshotProductsByPdfIdController } from "../controllers/snapshotProductsController.js";

const router = express.Router()

router.get("/:pdfId", verifyToken, getSnapshotProductsByPdfIdController);
router.post("/", verifyToken, createSnapshotProductController);

export default router;