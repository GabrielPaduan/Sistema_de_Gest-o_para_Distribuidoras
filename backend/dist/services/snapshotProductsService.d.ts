import type { SnapshotProductDTOInsert } from "../types/dtos.js";
export declare const createSnapshotProduct: (snapshotData: SnapshotProductDTOInsert) => Promise<SnapshotProductDTOInsert>;
export declare const getSnapshotProductsByPdfId: (pdfId: number) => Promise<SnapshotProductDTOInsert[]>;
export declare const deleteSnapshotProduct: (snapshotId: number) => Promise<void>;
//# sourceMappingURL=snapshotProductsService.d.ts.map