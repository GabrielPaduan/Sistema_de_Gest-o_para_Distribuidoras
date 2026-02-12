import express from 'express';
import * as modeloContratoItensController from '../controllers/modeloContratoItensController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:id', verifyToken, modeloContratoItensController.getModelContractItensById);
router.post('/', verifyToken, modeloContratoItensController.createModelContractItem);
router.delete('/:id', verifyToken, modeloContratoItensController.deleteModelContractItem);
router.put('/:id', verifyToken, modeloContratoItensController.updateModelContractItem);

export default router;