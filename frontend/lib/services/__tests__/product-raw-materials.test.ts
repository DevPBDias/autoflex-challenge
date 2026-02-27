import { vi, describe, it, expect, beforeEach } from "vitest";
import { productRawMaterialsService } from "../product-raw-materials";
import { api } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("productRawMaterialsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get composition by product id", async () => {
    const mockData = {
      composition: [
        { rawMaterialId: "1", productId: "1", requiredQuantity: 5 },
      ],
    };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await productRawMaterialsService.getComposition("1");

    expect(api.get).toHaveBeenCalledWith("/product-raw-materials/1");
    expect(result).toEqual(mockData.composition);
  });

  it("should associate raw material to product", async () => {
    const payload = {
      productId: "1",
      rawMaterialId: "2",
      requiredQuantity: 10,
    };
    const mockData = { association: { ...payload } };
    (api.post as any).mockResolvedValue({ data: mockData });

    const result = await productRawMaterialsService.associate(payload);

    expect(api.post).toHaveBeenCalledWith("/product-raw-materials", payload);
    expect(result).toEqual(mockData.association);
  });

  it("should disassociate raw material from product", async () => {
    (api.delete as any).mockResolvedValue({});

    await productRawMaterialsService.disassociate("1", "2");

    expect(api.delete).toHaveBeenCalledWith("/product-raw-materials/1/2");
  });
});
