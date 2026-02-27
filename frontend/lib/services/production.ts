import { api } from "@/lib/api-client";

export interface ProductionAvailability {
  productId: string;
  productName: string;
  quantityToProduce: number;
}

export const productionService = {
  getAvailability: async () => {
    const response = await api.get<{
      suggestion: { suggestedProduction: ProductionAvailability[] };
    }>("/production/suggest");
    return response.data.suggestion.suggestedProduction;
  },
};
