import express from 'express';
import { getAllClients, createClient, getClientById, deleteClient, getModelClients, getModelContracts, updateClient } from '../controllers/clientController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllClients);
router.post('/', verifyToken, createClient);
router.get('/:id', verifyToken, getClientById);
router.put('/:id', verifyToken, updateClient);
router.delete('/:id', verifyToken, deleteClient);
router.get('/modelos/list', verifyToken, getModelClients);
router.get('/modelos/:modelId', verifyToken, getModelContracts);

export default router;