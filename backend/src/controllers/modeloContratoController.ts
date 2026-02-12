import Express from "express";
import * as modeloContratoService from "../services/modeloContratoService.js";

export const getModelosContrato = async (req: Express.Request, res: Express.Response) => {
    try {
        const modelosContrato = await modeloContratoService.getAllModelContracts();
        res.status(200).json(modelosContrato);
    } catch (error) {
        console.error("Erro ao buscar modelos de contrato:", error);
        res.status(500).json({ error: "Erro ao buscar modelos de contrato" });
    }
}

export const getModeloContratoById = async (req: Express.Request, res: Express.Response) => {
    try {
        const id = Number(req.params.id);
        const modeloContrato = await modeloContratoService.getModelContractById(id);
        if (modeloContrato) {
            res.status(200).json(modeloContrato);
        } else {
            res.status(404).json({ error: "Modelo de contrato não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao buscar modelo de contrato:", error);
        res.status(500).json({ error: "Erro ao buscar modelo de contrato" });
    }
}

export const createModeloContrato = async (req: Express.Request, res: Express.Response) => {
    try {
        const modelContractData = req.body;
        const newModelContract = await modeloContratoService.createModelContract(modelContractData);
        res.status(201).json(newModelContract);
    }
    catch (error) {
        console.error("Erro ao criar modelo de contrato:", error);
        res.status(500).json({ error: "Erro ao criar modelo de contrato" });
    }
}

export const deleteModeloContrato = async (req: Express.Request, res: Express.Response) => {
    try {
        const id = Number(req.params.id);
        await modeloContratoService.deleteModelContract(id);
        res.status(204).send();
    }
    catch (error) {
        console.error("Erro ao deletar modelo de contrato:", error);
        res.status(500).json({ error: "Erro ao deletar modelo de contrato" });
    }
}