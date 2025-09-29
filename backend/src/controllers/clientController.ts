import express from 'express';
import * as clientService from '../services/clientService.js';

export const getAllClients = async (req: express.Request, res: express.Response) => {
    try {
        const clients = await clientService.findAllClients();
        res.status(200).json(clients);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createClient = async (req: express.Request, res: express.Response) => {
    try {
        console.log(req.body);
        const newClient = await clientService.createNewClient(req.body);
        res.status(201).json(newClient);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getClientById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const client = await clientService.findClientById(Number(id));
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(200).json(client);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteClient = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const deleted = await clientService.deleteClientById(Number(id));
        if (!deleted) {
            return res.status(404).json({ error: "Client not found" });
        }
        res.status(200).json({ message: "Client deleted successfully" });
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getModelClients = async (req: express.Request, res: express.Response) => {
    try {
        const clients = await clientService.findModelClients();
        res.status(200).json(clients);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};