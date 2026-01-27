import express from 'express';
export declare const getAllContracts: (req: express.Request, res: express.Response) => Promise<void>;
export declare const createContract: (req: express.Request, res: express.Response) => Promise<void>;
export declare const getContractByClientId: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const removeContract: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const updateContract: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=contractController.d.ts.map