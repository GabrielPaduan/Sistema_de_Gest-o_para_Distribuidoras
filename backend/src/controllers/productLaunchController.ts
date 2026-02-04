import express from 'express';
import * as productLaunchesService from '../services/productLaunchService.js'

export const getProductLaunches = async (req: express.Request, res: express.Response) => {
    try {
        const response = await productLaunchesService.getAllLaunches();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product launches' });
    }
}

export const createProductLaunch = async (req: express.Request, res: express.Response) => {
    try {
        const result = await productLaunchesService.createLaunch(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error("Erro no Controller createProductLaunch:", error);
        res.status(500).json({ error: 'Failed to create product launch' });
    }
}

export const getProductLaunchById = async (req: express.Request, res: express.Response) => {
    try {
        const launchId = req.params.id;
        const response = await productLaunchesService.getLaunchByProductId(Number(launchId));
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch product launch by ID' });
    }
}