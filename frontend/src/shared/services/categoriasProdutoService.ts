import { ProductsCategoriesDTO, ProductsCategoriesDTOInsert } from "../utils/DTOS";
import api from "./api";

export const getAllCategories = async (): Promise<ProductsCategoriesDTO[]> => {
  const response = await api.get('/categoriasProduto');
  return response.data; 
};

export const createCategory = async (categoria: ProductsCategoriesDTOInsert): Promise<ProductsCategoriesDTO> => {
  const response = await api.post('/categoriasProduto', categoria);
  return response.data; 
}

export const updateCategory = async (categoryID: number, categoria: ProductsCategoriesDTOInsert): Promise<ProductsCategoriesDTO> => {
  console.log(categoria)
  const response = await api.put(`/categoriasProduto/${categoryID}`, categoria);
  return response.data; 
}

export const deleteCategory = async (categoryID: number): Promise<void> => {
  await api.delete(`/categoriasProduto/${categoryID}`);
};