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
    const response = await api.get<{ rawMaterials: RawMaterial[] }>(
      "/raw-materials",
    );
    return response.data.rawMaterials;
  },
  getById: async (id: string) => {
    const response = await api.get<{ rawMaterial: RawMaterial }>(
      `/raw-materials/${id}`,
    );
    return response.data.rawMaterial;
  },
  create: async (payload: CreateRawMaterialDTO) => {
    const response = await api.post<{ rawMaterial: RawMaterial }>(
      "/raw-materials",
      payload,
    );
    return response.data.rawMaterial;
  },
  update: async (id: string, payload: UpdateRawMaterialDTO) => {
    const response = await api.patch<{ rawMaterial: RawMaterial }>(
      `/raw-materials/${id}`,
      payload,
    );
    return response.data.rawMaterial;
  },
  delete: async (id: string) => {
    await api.delete(`/raw-materials/${id}`);
  },
};
