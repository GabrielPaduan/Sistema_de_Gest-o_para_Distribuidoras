import express from 'express';
import * as contractService from '../services/contractService.js';

export const getAllContracts = async (req: express.Request, res: express.Response) => {
    try {
        const contracts = await contractService.findAllContracts();
        res.status(200).json(contracts);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createContract = async (req: express.Request, res: express.Response) => {
    try {
        const newContract = await contractService.createNewContract(req.body);
        res.status(201).json(newContract);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getContractByClientId = async (req: express.Request, res: express.Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Client ID is required' });
        }
        const contracts = await contractService.findContractsByClientId(req.params.id);
        res.status(200).json(contracts);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const removeContract = async (req: express.Request, res: express.Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Contract ID is required' });
        }
        await contractService.removeContract(Number(req.params.id));
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateContract = async (req: express.Request, res: express.Response) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'Contract ID is required' });
        }
        const { cmdt, qtde, valorTotal, porcLucro } = req.body; // Replace field1 and field2 with actual field names
        
        const updatedContract = await contractService.updateContract(
            Number(req.params.id),
            Number(cmdt),
            Number(qtde),
            Number(valorTotal),
            Number(porcLucro)
        );
        res.status(200).json(updatedContract);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
