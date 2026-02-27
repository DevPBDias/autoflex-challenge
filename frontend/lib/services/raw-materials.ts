import { api } from "@/lib/api-client";

export interface RawMaterial {
  id: string;
  code: string;
  name: string;
  stockQuantity: number;
}

export interface CreateRawMaterialDTO {
  code: string;
  name: string;
  stockQuantity: number;
}

export interface UpdateRawMaterialDTO extends Partial<CreateRawMaterialDTO> {}

export const rawMaterialsService = {
  getAll: async () => {
    const response = await api.get<{ data: RawMaterial[] }>("/raw-materials");
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await api.get<{ data: RawMaterial }>(
      `/raw-materials/${id}`,
    );
    return response.data.data;
  },
  create: async (data: CreateRawMaterialDTO) => {
    const response = await api.post<{ data: RawMaterial }>(
      "/raw-materials",
      data,
    );
    return response.data.data;
  },
  update: async (id: string, data: UpdateRawMaterialDTO) => {
    const response = await api.patch<{ data: RawMaterial }>(
      `/raw-materials/${id}`,
      data,
    );
    return response.data.data;
  },
  delete: async (id: string) => {
    await api.delete(`/raw-materials/${id}`);
  },
};
