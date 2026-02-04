import { ProductLaunch } from "../utils/DTOS";
import api from "./api";

export const getAllLaunches = async (): Promise<ProductLaunch[]> => {
    const response = await api.get('/product-launches');
    return response.data;
}

export const createLaunch = async (launchData: Omit<ProductLaunch, 'ID_Prod'>): Promise<ProductLaunch> => {
    const response = await api.post('/product-launches', launchData);
    return response.data;
}

export const getLaunchByProductId = async (productId: number): Promise<ProductLaunch[]> => {
    const response = await api.get(`/product-launches/${productId}`);
    return response.data;
}