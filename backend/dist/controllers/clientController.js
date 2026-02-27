import express from 'express';
import * as clientService from '../services/clientService.js';
export const getAllClients = async (req, res) => {
    try {
        const clients = await clientService.findAllClients();
        res.status(200).json(clients);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getClientByPDF = async (req, res) => {
    try {
        const client = await clientService.findClientByPDF();
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(200).json(client);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const createClient = async (req, res) => {
    try {
        const newClient = await clientService.createNewClient(req.body);
        res.status(201).json(newClient);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getClientById = async (req, res) => {
    const { id } = req.params;
    try {
        const client = await clientService.findClientById(Number(id));
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(200).json(client);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const deleteClient = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await clientService.deleteClientById(Number(id));
        if (!deleted) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(200).json({ message: "Client deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getModelClients = async (req, res) => {
    try {
        const clients = await clientService.findModelClients();
        res.status(200).json(clients);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getModelContracts = async (req, res) => {
    const { modelId } = req.params;
    try {
        const contracts = await clientService.getModelContracts(Number(modelId));
        if (!contracts) {
            return res.status(404).json({ error: "No contracts found for the given model ID" });
        }
        res.status(200).json(contracts);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateClient = async (req, res) => {
    try {
        const updatedClient = await clientService.updateClientById(req.body);
        if (!updatedClient) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(200).json(updatedClient);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateClientStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedClient = await clientService.updateStatusClient(Number(id));
        if (!updatedClient) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(200).json(updatedClient);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const searchClientsByName = async (req, res) => {
    const q = req.query.q;
    try {
        if (typeof q !== 'string') {
            return res.status(400).json({ error: "Query parameter 'q' is required and must be a string" });
        }
        const clients = await clientService.searchClientsByName(q);
        res.status(200).json(clients);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//# sourceMappingURL=clientController.js.map