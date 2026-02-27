import type { ModelosContratoItensDTO, ModelosContratoItensDTOInsert } from "../types/dtos.js";
export declare const getModelContractItensById: (id: number) => Promise<ModelosContratoItensDTO[]>;
export declare const createModelContractItem: (itemData: ModelosContratoItensDTOInsert) => Promise<ModelosContratoItensDTO>;
export declare const deleteModelContractItem: (id: number) => Promise<void>;
export declare const updateModelContractItem: (id: number, cmdt: number, porcLucro: number) => Promise<ModelosContratoItensDTO>;
//# sourceMappingURL=modeloContratoItensService.d.ts.map