import { ProductRawMaterialService } from "../product-raw-material.service";
import { ProductRawMaterialRepository } from "../product-raw-material.repository";
import { prisma } from "../../../config/prisma";

jest.mock("../../../config/prisma", () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
    },
    rawMaterial: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("../product-raw-material.repository");

describe("ProductRawMaterialService", () => {
  let service: ProductRawMaterialService;
  let repositoryMock: jest.Mocked<ProductRawMaterialRepository>;

  const VALID_UUID_PROD = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
  const VALID_UUID_RM = "b2c3d4e5-f6a7-8901-bcde-f12345678901";

  beforeEach(() => {
    service = new ProductRawMaterialService();
    repositoryMock = (service as any).repository;
    jest.clearAllMocks();
  });

  describe("addRawMaterialToProduct", () => {
    it("should add association successfully", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        id: VALID_UUID_PROD,
      });
      (prisma.rawMaterial.findUnique as jest.Mock).mockResolvedValue({
        id: VALID_UUID_RM,
      });
      repositoryMock.upsertAssociation.mockResolvedValue({} as any);

      const data = {
        productId: VALID_UUID_PROD,
        rawMaterialId: VALID_UUID_RM,
        requiredQuantity: 5,
      };

      await service.addRawMaterialToProduct(data);

      expect(repositoryMock.upsertAssociation).toHaveBeenCalledWith(data);
    });

    it("should throw 404 if product not found", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.addRawMaterialToProduct({
          productId: VALID_UUID_PROD,
          rawMaterialId: VALID_UUID_RM,
          requiredQuantity: 5,
        }),
      ).rejects.toEqual({ status: 404, message: "Product not found" });
    });

    it("should throw 404 if raw material not found", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        id: VALID_UUID_PROD,
      });
      (prisma.rawMaterial.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.addRawMaterialToProduct({
          productId: VALID_UUID_PROD,
          rawMaterialId: VALID_UUID_RM,
          requiredQuantity: 5,
        }),
      ).rejects.toEqual({ status: 404, message: "Raw material not found" });
    });
  });

  describe("removeRawMaterialFromProduct", () => {
    it("should remove successfully", async () => {
      repositoryMock.deleteAssociation.mockResolvedValue({} as any);
      await service.removeRawMaterialFromProduct(
        VALID_UUID_PROD,
        VALID_UUID_RM,
      );
      expect(repositoryMock.deleteAssociation).toHaveBeenCalledWith(
        VALID_UUID_PROD,
        VALID_UUID_RM,
      );
    });

    it("should throw 404 if association not found", async () => {
      repositoryMock.deleteAssociation.mockRejectedValue(new Error("P2025")); // Prisma not found error code simulation
      await expect(
        service.removeRawMaterialFromProduct(VALID_UUID_PROD, VALID_UUID_RM),
      ).rejects.toEqual({ status: 404, message: "Association not found" });
    });
  });

  describe("getProductComposition", () => {
    it("should return composition", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({
        id: VALID_UUID_PROD,
      });
      repositoryMock.findProductComposition.mockResolvedValue([] as any);
      const result = await service.getProductComposition(VALID_UUID_PROD);
      expect(result).toEqual([]);
    });

    it("should throw 404 if product not found", async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(
        service.getProductComposition(VALID_UUID_PROD),
      ).rejects.toEqual({ status: 404, message: "Product not found" });
    });
  });
});
