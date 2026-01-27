import express from 'express';
export declare const getAllClients: (req: express.Request, res: express.Response) => Promise<void>;
export declare const getClientByPDF: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const createClient: (req: express.Request, res: express.Response) => Promise<void>;
export declare const getClientById: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const deleteClient: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const getModelClients: (req: express.Request, res: express.Response) => Promise<void>;
export declare const getModelContracts: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const updateClient: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=clientController.d.ts.map