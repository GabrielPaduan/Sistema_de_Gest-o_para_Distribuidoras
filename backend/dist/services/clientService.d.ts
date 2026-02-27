import type { ClientDTO, ClientDTOInsert, ContractDTO } from '../types/dtos.js';
export declare const findAllClients: () => Promise<ClientDTO[]>;
export declare const findClientByPDF: () => Promise<ClientDTO[]>;
export declare const updateClientById: (clientData: ClientDTO) => Promise<boolean>;
export declare const findModelClients: () => Promise<ClientDTO[]>;
export declare const createNewClient: (clientData: ClientDTOInsert) => Promise<ClientDTO[]>;
export declare const findClientById: (id: number) => Promise<ClientDTO | null>;
export declare const deleteClientById: (id: number) => Promise<boolean>;
export declare const getModelContracts: (modelId: number) => Promise<ContractDTO[] | null>;
export declare const updateStatusClient: (id: number) => Promise<boolean>;
export declare const searchClientsByName: (name: string) => Promise<ClientDTO[]>;
//# sourceMappingURL=clientService.d.ts.map