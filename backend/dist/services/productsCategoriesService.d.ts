import type { ProductsCategoriesDTO, ProductsCategoriesDTOInsert } from '../types/dtos.js';
export declare const findAllCategories: () => Promise<ProductsCategoriesDTO[]>;
export declare const createCategory: (categoria: ProductsCategoriesDTOInsert) => Promise<ProductsCategoriesDTOInsert>;
export declare const updateCategory: (categoryID: number, categoria: ProductsCategoriesDTOInsert) => Promise<ProductsCategoriesDTO>;
export declare const deleteCategory: (categoryID: number) => Promise<void>;
//# sourceMappingURL=productsCategoriesService.d.ts.map