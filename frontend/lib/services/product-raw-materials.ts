import { api } from "@/lib/api-client";
import { RawMaterial } from "@/lib/services/raw-materials";

export interface ProductRawMaterial {
  productId: string;
  rawMaterialId: string;
  requiredQuantity: number;
  rawMaterial?: RawMaterial;
}

export interface AddRawMaterialToProductDTO {
  productId: string;
  rawMaterialId: string;
  requiredQuantity: number;
}

export const productRawMaterialsService = {
  getComposition: async (productId: string) => {
    const response = await api.get<{ data: ProductRawMaterial[] }>(
      `/product-raw-materials/${productId}`,
    );
    return response.data.data;
  },
  associate: async (data: AddRawMaterialToProductDTO) => {
    const response = await api.post<{ data: any }>(
      "/product-raw-materials",
      data,
    );
    return response.data.data;
  },
  disassociate: async (productId: string, rawMaterialId: string) => {
    await api.delete(`/product-raw-materials/${productId}/${rawMaterialId}`);
  },
};
