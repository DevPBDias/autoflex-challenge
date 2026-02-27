import { api } from "@/lib/api-client";

export interface Product {
  id: string;
  code: string;
  name: string;
  value: number;
}

export interface CreateProductDTO {
  code: string;
  name: string;
  value: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export const productsService = {
  getAll: async () => {
    const response = await api.get<{ products: Product[] }>("/products");
    return response.data.products;
  },
  getById: async (id: string) => {
    const response = await api.get<{ product: Product }>(`/products/${id}`);
    return response.data.product;
  },
  create: async (payload: CreateProductDTO) => {
    const response = await api.post<{ product: Product }>("/products", payload);
    return response.data.product;
  },
  update: async (id: string, payload: UpdateProductDTO) => {
    const response = await api.patch<{ product: Product }>(
      `/products/${id}`,
      payload,
    );
    return response.data.product;
  },
  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
};
