import type { ProductLaunch } from "../types/dtos.js";
export declare const getAllLaunches: () => Promise<ProductLaunch[]>;
export declare const createLaunch: (launchProductData: Omit<ProductLaunch, "LancProd_ID">) => Promise<ProductLaunch>;
export declare const getLaunchByProductId: (productId: number) => Promise<ProductLaunch[]>;
//# sourceMappingURL=productLaunchService.d.ts.map