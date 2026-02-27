import type { ModelosContratoDTO, ModelosContratoDTOInsert } from "../types/dtos.js";
export declare const getAllModelContracts: () => Promise<ModelosContratoDTO[]>;
export declare const getModelContractById: (id: number) => Promise<ModelosContratoDTO | null>;
export declare const createModelContract: (modelContract: ModelosContratoDTOInsert) => Promise<ModelosContratoDTO>;
export declare const deleteModelContract: (id: number) => Promise<void>;
//# sourceMappingURL=modeloContratoService.d.ts.map