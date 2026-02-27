import { vi, describe, it, expect, beforeEach } from "vitest";
import { productionService } from "../production";
import { api } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("productionService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get production availability", async () => {
    const mockData = {
      suggestion: {
        suggestedProduction: [
          { productId: "1", productName: "Table", quantityToProduce: 5 },
        ],
      },
    };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await productionService.getAvailability();

    expect(api.get).toHaveBeenCalledWith("/production/suggest");
    expect(result).toEqual(mockData.suggestion.suggestedProduction);
  });
});
