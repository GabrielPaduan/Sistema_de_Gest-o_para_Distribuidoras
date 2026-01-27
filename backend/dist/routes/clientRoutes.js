import express from 'express';
import { getAllClients, createClient, getClientById, deleteClient, getModelClients, getModelContracts, updateClient, getClientByPDF } from '../controllers/clientController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
const router = express.Router();
router.get('/', verifyToken, getAllClients);
router.post('/', verifyToken, createClient);
router.get('/:id', verifyToken, getClientById);
router.put('/:id', verifyToken, updateClient);
router.delete('/:id', verifyToken, deleteClient);
router.get('/modelos/list', verifyToken, getModelClients);
router.get('/modelos/:modelId', verifyToken, getModelContracts);
router.get('/pdfClientes/list', verifyToken, getClientByPDF); // Adiciona a rota para buscar cliente por PDF
export default router;
//# sourceMappingURL=clientRoutes.js.map