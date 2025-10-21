import express from 'express';
import { getAllContracts, createContract, getContractByClientId, removeContract, updateContract } from '../controllers/contractController.js';
import { verify } from 'crypto';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllContracts);
router.post('/', verifyToken, createContract);
router.get('/:id', verifyToken, getContractByClientId);
router.put('/:id/', verifyToken, updateContract);
router.delete('/:id', verifyToken, removeContract);

export default router;