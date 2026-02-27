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
    const response = await api.get<{ composition: ProductRawMaterial[] }>(
      `/product-raw-materials/${productId}`,
    );
    return response.data.composition;
  },
  associate: async (payload: AddRawMaterialToProductDTO) => {
    const response = await api.post<{ association: ProductRawMaterial }>(
      "/product-raw-materials",
      payload,
    );
    return response.data.association;
  },
  disassociate: async (productId: string, rawMaterialId: string) => {
    await api.delete(`/product-raw-materials/${productId}/${rawMaterialId}`);
  },
};
