import express from 'express';
import { getAllClients, createClient, getClientById, deleteClient, getModelClients } from '../controllers/clientController.js';

const router = express.Router();

router.get('/', getAllClients);
router.post('/', createClient);
router.get('/:id', getClientById);
// router.put('/:id', updateClient);
router.delete('/:id', deleteClient);
router.get('/modelos/list', getModelClients);

export default router;