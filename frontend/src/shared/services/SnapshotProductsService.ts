import { SnapshotProductDTO, SnapshotProductDTOInsert } from "../utils/DTOS";
import api from "./api";

export const createSnapshotProduct = async (snapshotData: SnapshotProductDTOInsert): Promise<SnapshotProductDTO> => {
    const response = await api.post('/snapshotProducts', snapshotData);
    return response.data;
}