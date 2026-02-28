import { api } from "@/lib/api-client";

export interface ProductionAvailability {
  productId: string;
  productName: string;
  quantityToProduce: number;
}

export interface ProductionResponse {
  suggestedProduction: ProductionAvailability[];
  totalEstimatedValue: number;
}

export const productionService = {
  getAvailability: async (): Promise<ProductionResponse> => {
    const response = await api.get<{
      suggestion: ProductionResponse;
    }>("/production/suggest");
    return response.data.suggestion;
  },
};
