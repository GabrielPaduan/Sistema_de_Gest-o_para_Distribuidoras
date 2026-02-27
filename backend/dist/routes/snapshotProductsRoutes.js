import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { createSnapshotProductController, deleteSnapshotProductController, getSnapshotProductsByPdfIdController } from "../controllers/snapshotProductsController.js";
const router = express.Router();
router.get("/:pdfId", verifyToken, getSnapshotProductsByPdfIdController);
router.post("/", verifyToken, createSnapshotProductController);
router.delete("/:snapshotId", verifyToken, deleteSnapshotProductController);
export default router;
//# sourceMappingURL=snapshotProductsRoutes.js.map