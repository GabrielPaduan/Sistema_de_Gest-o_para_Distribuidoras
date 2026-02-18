import express from 'express';
import { getAllClients, createClient, getClientById, deleteClient, getModelClients, getModelContracts, updateClient, getClientByPDF, updateClientStatus } from '../controllers/clientController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', verifyToken, getAllClients);
router.post('/', verifyToken, createClient);
router.get('/:id', verifyToken, getClientById);
router.put('/:id', verifyToken, updateClient);
router.delete('/:id', verifyToken, deleteClient);
router.get('/modelos/list', verifyToken, getModelClients);
router.get('/modelos/:modelId', verifyToken, getModelContracts);
router.get('/pdfClientes/list', verifyToken, getClientByPDF);
router.put('/status/:id', verifyToken, updateClientStatus); 

export default router;