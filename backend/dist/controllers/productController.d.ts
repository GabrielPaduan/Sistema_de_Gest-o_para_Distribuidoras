import express from 'express';
export declare const getAllProducts: (req: express.Request, res: express.Response) => Promise<void>;
export declare const getProductsWithPagination: (req: express.Request, res: express.Response) => Promise<void>;
export declare const createProduct: (req: express.Request, res: express.Response) => Promise<void>;
export declare const updateProduct: (req: express.Request, res: express.Response) => Promise<void>;
export declare const getProductById: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const getProductByContractId: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const searchProducts: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
export declare const deleteProduct: (req: express.Request, res: express.Response) => Promise<express.Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=productController.d.ts.map