import { ProductRepository } from "../product.repository";
import { prisma } from "../../../config/prisma";

jest.mock("../../../config/prisma", () => ({
  prisma: {
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

const prismaMock = prisma.product as unknown as {
  create: jest.Mock;
  findMany: jest.Mock;
  findUnique: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

describe("ProductRepository", () => {
  let repository: ProductRepository;

  const VALID_UUID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

  const mockProduct = {
    id: VALID_UUID,
    code: "PRD-001",
    name: "Steel Cabinet",
    value: 1250.99 as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    repository = new ProductRepository();
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("should call prisma.product.create with correct data", async () => {
      const input = { code: "PRD-001", name: "Steel Cabinet", value: 1250.99 };
      prismaMock.create.mockResolvedValue(mockProduct);

      const result = await repository.createProduct(input);

      expect(prismaMock.create).toHaveBeenCalledWith({ data: input });
      expect(result).toEqual(mockProduct);
    });

    it("should propagate prisma errors on create", async () => {
      prismaMock.create.mockRejectedValue(
        new Error("Unique constraint failed"),
      );

      await expect(
        repository.createProduct({ code: "PRD-001", name: "Test", value: 10 }),
      ).rejects.toThrow("Unique constraint failed");
    });
  });

  describe("findAllProducts", () => {
    it("should call prisma.product.findMany", async () => {
      prismaMock.findMany.mockResolvedValue([mockProduct]);

      const result = await repository.findAllProducts();

      expect(prismaMock.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockProduct]);
    });

    it("should return empty array when no products exist", async () => {
      prismaMock.findMany.mockResolvedValue([]);

      const result = await repository.findAllProducts();

      expect(result).toEqual([]);
    });
  });

  describe("findOneProductById", () => {
    it("should call prisma.product.findUnique with correct id", async () => {
      prismaMock.findUnique.mockResolvedValue(mockProduct);

      const result = await repository.findOneProductById(VALID_UUID);

      expect(prismaMock.findUnique).toHaveBeenCalledWith({
        where: { id: VALID_UUID },
      });
      expect(result).toEqual(mockProduct);
    });

    it("should return null when product is not found", async () => {
      prismaMock.findUnique.mockResolvedValue(null);

      const result = await repository.findOneProductById(VALID_UUID);

      expect(result).toBeNull();
    });
  });

  describe("findProductByCode", () => {
    it("should call prisma.product.findUnique with correct code", async () => {
      prismaMock.findUnique.mockResolvedValue(mockProduct);

      const result = await repository.findProductByCode("PRD-001");

      expect(prismaMock.findUnique).toHaveBeenCalledWith({
        where: { code: "PRD-001" },
      });
      expect(result).toEqual(mockProduct);
    });

    it("should return null when code is not found", async () => {
      prismaMock.findUnique.mockResolvedValue(null);

      const result = await repository.findProductByCode("NONEXISTENT");

      expect(result).toBeNull();
    });
  });

  describe("updateProduct", () => {
    it("should call prisma.product.update with correct params", async () => {
      const updateData = { name: "Updated Name" };
      const updatedProduct = { ...mockProduct, name: "Updated Name" };
      prismaMock.update.mockResolvedValue(updatedProduct);

      const result = await repository.updateProduct(VALID_UUID, updateData);

      expect(prismaMock.update).toHaveBeenCalledWith({
        where: { id: VALID_UUID },
        data: updateData,
      });
      expect(result.name).toBe("Updated Name");
    });

    it("should propagate prisma errors on update", async () => {
      prismaMock.update.mockRejectedValue(new Error("Record not found"));

      await expect(
        repository.updateProduct(VALID_UUID, { name: "X" }),
      ).rejects.toThrow("Record not found");
    });
  });

  describe("deleteProduct", () => {
    it("should call prisma.product.delete with correct id", async () => {
      prismaMock.delete.mockResolvedValue(mockProduct);

      const result = await repository.deleteProduct(VALID_UUID);

      expect(prismaMock.delete).toHaveBeenCalledWith({
        where: { id: VALID_UUID },
      });
      expect(result).toEqual(mockProduct);
    });

    it("should propagate prisma errors on delete", async () => {
      prismaMock.delete.mockRejectedValue(new Error("Record not found"));

      await expect(repository.deleteProduct(VALID_UUID)).rejects.toThrow(
        "Record not found",
      );
    });
  });
});
