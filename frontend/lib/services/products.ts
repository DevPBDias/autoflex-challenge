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
    const response = await api.get<{ data: Product[] }>("/products");
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await api.get<{ data: Product }>(`/products/${id}`);
    return response.data.data;
  },
  create: async (data: CreateProductDTO) => {
    const response = await api.post<{ data: Product }>("/products", data);
    return response.data.data;
  },
  update: async (id: string, data: UpdateProductDTO) => {
    const response = await api.patch<{ data: Product }>(
      `/products/${id}`,
      data,
    );
    return response.data.data;
  },
  delete: async (id: string) => {
    await api.delete(`/products/${id}`);
  },
};
