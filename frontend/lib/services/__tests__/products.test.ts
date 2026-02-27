import { vi, describe, it, expect, beforeEach } from "vitest";
import { productsService } from "../products";
import { api } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("productsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get all products", async () => {
    const mockData = { products: [{ id: "1", name: "Table" }] };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await productsService.getAll();

    expect(api.get).toHaveBeenCalledWith("/products");
    expect(result).toEqual(mockData.products);
  });

  it("should get product by id", async () => {
    const mockData = { product: { id: "1", name: "Table" } };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await productsService.getById("1");

    expect(api.get).toHaveBeenCalledWith("/products/1");
    expect(result).toEqual(mockData.product);
  });

  it("should create product", async () => {
    const payload = { code: "T1", name: "Table", value: 100 };
    const mockData = { product: { id: "1", ...payload } };
    (api.post as any).mockResolvedValue({ data: mockData });

    const result = await productsService.create(payload);

    expect(api.post).toHaveBeenCalledWith("/products", payload);
    expect(result).toEqual(mockData.product);
  });

  it("should update product", async () => {
    const payload = { name: "Chair" };
    const mockData = { product: { id: "1", name: "Chair" } };
    (api.patch as any).mockResolvedValue({ data: mockData });

    const result = await productsService.update("1", payload);

    expect(api.patch).toHaveBeenCalledWith("/products/1", payload);
    expect(result).toEqual(mockData.product);
  });

  it("should delete product", async () => {
    (api.delete as any).mockResolvedValue({});

    await productsService.delete("1");

    expect(api.delete).toHaveBeenCalledWith("/products/1");
  });
});
