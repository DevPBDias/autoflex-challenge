import { ProductionService } from "../production.service";
import { prisma } from "../../../config/prisma";

jest.mock("../../../config/prisma", () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
    rawMaterial: {
      findMany: jest.fn(),
    },
  },
}));

const prismaMock = prisma as any;

describe("ProductionService", () => {
  let service: ProductionService;

  beforeEach(() => {
    service = new ProductionService();
    jest.clearAllMocks();
  });

  it("should suggest production correctly prioritizing high value products", async () => {
    prismaMock.rawMaterial.findMany.mockResolvedValue([
      { id: "rm-1", code: "STEEL", stockQuantity: 10 },
      { id: "rm-2", code: "PLASTIC", stockQuantity: 20 },
    ] as any);

    prismaMock.product.findMany.mockResolvedValue([
      {
        id: "prod-high",
        name: "Premium Desktop",
        value: 1000,
        rawMaterials: [
          { rawMaterialId: "rm-1", requiredQuantity: 5 },
          { rawMaterialId: "rm-2", requiredQuantity: 2 },
        ],
      },
      {
        id: "prod-low",
        name: "Budget Desktop",
        value: 500,
        rawMaterials: [
          { rawMaterialId: "rm-1", requiredQuantity: 2 },
          { rawMaterialId: "rm-2", requiredQuantity: 10 },
        ],
      },
    ] as any);

    const result = await service.suggestProduction();

    expect(result.suggestedProduction).toHaveLength(1);
    expect(result.suggestedProduction[0]?.productName).toBe("Premium Desktop");
    expect(result.suggestedProduction[0]?.quantityToProduce).toBe(2);
    expect(result.totalEstimatedValue).toBe(2000);
  });

  it("should return empty suggestion if no stock is available", async () => {
    prismaMock.rawMaterial.findMany.mockResolvedValue([
      { id: "rm-1", code: "STEEL", stockQuantity: 0 },
    ] as any);
    prismaMock.product.findMany.mockResolvedValue([
      {
        id: "p1",
        name: "X",
        value: 100,
        rawMaterials: [{ rawMaterialId: "rm-1", requiredQuantity: 1 }],
      },
    ] as any);

    const result = await service.suggestProduction();
    expect(result.suggestedProduction).toHaveLength(0);
    expect(result.totalEstimatedValue).toBe(0);
  });

  it("should skip products without raw materials", async () => {
    prismaMock.rawMaterial.findMany.mockResolvedValue([] as any);
    prismaMock.product.findMany.mockResolvedValue([
      { id: "p1", name: "Empty", value: 100, rawMaterials: [] },
    ] as any);

    const result = await service.suggestProduction();
    expect(result.suggestedProduction).toHaveLength(0);
  });
});
