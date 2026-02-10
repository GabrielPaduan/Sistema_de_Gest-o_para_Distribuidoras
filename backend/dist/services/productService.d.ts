import type { ProductDTO, ProductLaunching } from '../types/dtos.js';
export declare const findAllProduct: () => Promise<ProductDTO[]>;
export declare const createNewProduct: (productData: Omit<ProductDTO, "id">) => Promise<ProductDTO[]>;
export declare const updateProduct: (productData: ProductDTO) => Promise<void>;
export declare const findProductById: (id: number) => Promise<ProductDTO | null>;
export declare const findProductByContractId: (contractId: number) => Promise<ProductDTO | null>;
export declare const searchProductsByName: (nameQuery: string) => Promise<any[]>;
export declare const deleteProductById: (id: number) => Promise<void>;
export declare function findAllProductWithPagination(page: number, pageSize: number): {
    products: any;
    total: any;
} | PromiseLike<{
    products: any;
    total: any;
}>;
export declare const productLaunch: (productToLaunch: ProductLaunching, launchType: number) => Promise<void>;
//# sourceMappingURL=productService.d.ts.map