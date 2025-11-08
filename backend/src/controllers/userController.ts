import express from 'express';
import * as userService from '../services/userService.js';

export const createUser = async (req: express.Request, res: express.Response) => {
    try {
        const user = await userService.createUserService(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const user = await userService.loginUser(req.body);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error logging in user:", error);
        const errorMessage = (error instanceof Error) ? error.message : "Credenciais inválidas";
        res.status(401).json({ message: errorMessage });
    }
};