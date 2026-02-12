import Express from "express";
import * as modeloContratoItensService from "../services/modeloContratoItensService.js";


export const getModelContractItensById = async (req: Express.Request, res: Express.Response) => {
    try {
        const id = Number(req.params.id);
        const itens = await modeloContratoItensService.getModelContractItensById(id);
        res.status(200).json(itens);
    } catch (error) {
        console.error("Erro ao buscar itens do modelo de contrato:", error);
        res.status(500).json({ message: "Erro ao buscar itens do modelo de contrato", error });
    }
}

export const createModelContractItem = async (req: Express.Request, res: Express.Response) => {
    try {
        const itemData = req.body;
        const newItem = await modeloContratoItensService.createModelContractItem(itemData);
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Erro ao criar item do modelo de contrato:", error);
        res.status(500).json({ message: "Erro ao criar item do modelo de contrato", error });
    }
}

export const deleteModelContractItem = async (req: Express.Request, res: Express.Response) => {
    try {
        const id = Number(req.params.id);
        await modeloContratoItensService.deleteModelContractItem(id);
        res.status(204).send();
    } catch (error) {
        console.error("Erro ao deletar item do modelo de contrato:", error);
        res.status(500).json({ message: "Erro ao deletar item do modelo de contrato", error });
    }
}

export const updateModelContractItem = async (req: Express.Request, res: Express.Response) => {
    try {
        const id = Number(req.params.id);
        const { modelContItens_Comodato, modelContItens_PorcLucro } = req.body;
        const updatedItem = await modeloContratoItensService.updateModelContractItem(id, modelContItens_Comodato, modelContItens_PorcLucro);
        res.status(200).json(updatedItem);
    }
    catch (error) {
        console.error("Erro ao atualizar item do modelo de contrato:", error);
        res.status(500).json({ message: "Erro ao atualizar item do modelo de contrato", error });
    }
}