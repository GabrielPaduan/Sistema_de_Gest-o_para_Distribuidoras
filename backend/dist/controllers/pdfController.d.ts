import express from "express";
export declare const getPdfs: (req: express.Request, res: express.Response) => Promise<void>;
export declare const getPdfByStatus: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const getPdfById: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const createPdf: (req: express.Request, res: express.Response) => Promise<void>;
export declare const updatePdf: (req: express.Request, res: express.Response) => Promise<void>;
export declare const getPendentPdfByClientId: (req: express.Request, res: express.Response) => Promise<void>;
export declare const getPdfByClientId: (req: express.Request, res: express.Response) => Promise<void>;
//# sourceMappingURL=pdfController.d.ts.map