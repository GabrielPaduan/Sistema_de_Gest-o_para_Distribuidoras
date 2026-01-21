import { ProductsCategoriesDTO, ProductsCategoriesDTOInsert } from "../utils/DTOS";
import api from "./api";

export const getAllCategories = async (): Promise<ProductsCategoriesDTO[]> => {
  const response = await api.get('/categoriasProduto');
  return response.data; 
};

export const createCategory = async (nomeCategoria: ProductsCategoriesDTOInsert): Promise<ProductsCategoriesDTO> => {
  console.log(nomeCategoria);
  const response = await api.post('/categoriasProduto', nomeCategoria);
  return response.data; 
}

export const updateCategory = async (categoryID: number, nomeCategoria: ProductsCategoriesDTOInsert): Promise<ProductsCategoriesDTO> => {
  const response = await api.put(`/categoriasProduto/${categoryID}`, nomeCategoria);
  return response.data; 
}

export const deleteCategory = async (categoryID: number): Promise<void> => {
  await api.delete(`/categoriasProduto/${categoryID}`);
};