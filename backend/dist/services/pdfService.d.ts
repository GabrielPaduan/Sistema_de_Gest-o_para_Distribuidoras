import type { PdfStructDTO, PdfStructInsertDTO } from "../types/dtos.js";
export declare const getAllPdfs: () => Promise<PdfStructDTO[]>;
export declare const getPdfByStatus: (status: number) => Promise<PdfStructDTO[]>;
export declare const getPdfById: (id: number) => Promise<PdfStructDTO>;
export declare const createPdf: (pdfData: PdfStructInsertDTO) => Promise<any[]>;
export declare const getPendentPdfByClientId: (clientId: number) => Promise<PdfStructDTO | null>;
export declare const getPdfByClientId: (clientId: number) => Promise<PdfStructDTO[]>;
export declare const updatePdf: (id: number, PDF_Client_Id: number, PDF_Status: number, PDF_Generated_Date: string, PDF_Observacoes: string, PDF_Valor: number, PDF_ValorPago: number) => Promise<{
    PDF_Client_Id: number;
    PDF_Status: number;
    PDF_Generated_Date: string;
    PDF_Observacoes: string;
    PDF_Valor: number;
    PDF_ValorPago: number;
}>;
export declare const deletePdf: (id: number) => Promise<void>;
//# sourceMappingURL=pdfService.d.ts.map