import express from "express";
import * as modeloContratoController from "../controllers/modeloContratoController.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/', verifyToken, modeloContratoController.getModelosContrato);
router.post('/', verifyToken, modeloContratoController.createModeloContrato);
router.delete('/:id', verifyToken, modeloContratoController.deleteModeloContrato);

export default router;