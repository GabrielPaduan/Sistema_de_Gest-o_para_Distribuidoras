import type { ContractDTO } from '../types/dtos.js';
export declare const findAllContracts: () => Promise<ContractDTO[]>;
export declare const createNewContract: (contractData: Omit<ContractDTO, "id">) => Promise<ContractDTO[]>;
export declare const findContractsByClientId: (clientId: string) => Promise<ContractDTO[]>;
export declare const removeContract: (contractId: number) => Promise<void>;
export declare const updateContract: (contractId: number, cmdt: number, qtde: number, valorTotal: number, porcLucro: number) => Promise<{
    Cont_Comodato: number;
    Cont_Qtde: number;
    Cont_ValorTotal: number;
    Cont_PorcLucro: number;
}>;
//# sourceMappingURL=contractService.d.ts.map