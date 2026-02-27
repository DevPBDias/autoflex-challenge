import { vi, describe, it, expect, beforeEach } from "vitest";
import { rawMaterialsService } from "../raw-materials";
import { api } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("rawMaterialsService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get all raw materials", async () => {
    const mockData = { rawMaterials: [{ id: "1", name: "Iron" }] };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await rawMaterialsService.getAll();

    expect(api.get).toHaveBeenCalledWith("/raw-materials");
    expect(result).toEqual(mockData.rawMaterials);
  });

  it("should get raw material by id", async () => {
    const mockData = { rawMaterial: { id: "1", name: "Iron" } };
    (api.get as any).mockResolvedValue({ data: mockData });

    const result = await rawMaterialsService.getById("1");

    expect(api.get).toHaveBeenCalledWith("/raw-materials/1");
    expect(result).toEqual(mockData.rawMaterial);
  });

  it("should create raw material", async () => {
    const payload = { code: "FE", name: "Iron", stockQuantity: 100 };
    const mockData = { rawMaterial: { id: "1", ...payload } };
    (api.post as any).mockResolvedValue({ data: mockData });

    const result = await rawMaterialsService.create(payload);

    expect(api.post).toHaveBeenCalledWith("/raw-materials", payload);
    expect(result).toEqual(mockData.rawMaterial);
  });

  it("should update raw material", async () => {
    const payload = { name: "Steel" };
    const mockData = {
      rawMaterial: { id: "1", code: "FE", name: "Steel", stockQuantity: 100 },
    };
    (api.patch as any).mockResolvedValue({ data: mockData });

    const result = await rawMaterialsService.update("1", payload);

    expect(api.patch).toHaveBeenCalledWith("/raw-materials/1", payload);
    expect(result).toEqual(mockData.rawMaterial);
  });

  it("should delete raw material", async () => {
    (api.delete as any).mockResolvedValue({});

    await rawMaterialsService.delete("1");

    expect(api.delete).toHaveBeenCalledWith("/raw-materials/1");
  });
});
