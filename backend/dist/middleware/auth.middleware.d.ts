import express, { type NextFunction, type Request, type Response } from 'express';
import 'dotenv/config';
declare global {
    namespace Express {
        interface Request {
            user?: {
                sub: string;
                name: string;
                role: string;
            };
        }
    }
}
export declare const verifyToken: (req: express.Request, res: express.Response, next: NextFunction) => express.Response<any, Record<string, any>> | undefined;
export declare const authorizeRoles: (...allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => express.Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.middleware.d.ts.map