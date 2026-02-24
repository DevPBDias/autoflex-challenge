import { ProductService } from "../product.service";
import { ProductRepository } from "../product.repository";

jest.mock("../product.repository");

describe("ProductService", () => {
  let service: ProductService;
  let repositoryMock: jest.Mocked<ProductRepository>;

  const VALID_UUID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
  const OTHER_UUID = "b2c3d4e5-f6a7-8901-bcde-f12345678901";

  const mockProduct = {
    id: VALID_UUID,
    code: "PRD-001",
    name: "Steel Cabinet",
    value: 1250.99 as any,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    service = new ProductService();
    repositoryMock = (service as any).repository;
  });

  describe("createProduct", () => {
    it("should create a product successfully", async () => {
      repositoryMock.findProductByCode.mockResolvedValue(null);
      repositoryMock.createProduct.mockResolvedValue(mockProduct);

      const result = await service.createProduct({
        code: "PRD-001",
        name: "Steel Cabinet",
        value: 1250.99,
      });

      expect(result).toEqual(mockProduct);
      expect(repositoryMock.findProductByCode).toHaveBeenCalledWith("PRD-001");
      expect(repositoryMock.createProduct).toHaveBeenCalledTimes(1);
    });

    it("should throw 422 when required fields are missing", async () => {
      await expect(service.createProduct({} as any)).rejects.toEqual({
        status: 422,
        message: "Field 'code' must be a non-empty string",
      });
    });

    it("should throw 422 when code is empty string", async () => {
      await expect(
        service.createProduct({ code: "  ", name: "Test", value: 10 }),
      ).rejects.toEqual({
        status: 422,
        message: "Field 'code' must be a non-empty string",
      });
    });

    it("should throw 422 when code is not a string type", async () => {
      await expect(
        service.createProduct({ code: 123 as any, name: "Test", value: 10 }),
      ).rejects.toEqual({
        status: 422,
        message: "Field 'code' must be a non-empty string",
      });
    });

    it("should throw 422 when name is empty string", async () => {
      await expect(
        service.createProduct({ code: "PRD-X", name: "", value: 10 }),
      ).rejects.toEqual({
        status: 422,
        message: "Field 'name' must be a non-empty string",
      });
    });

    it("should throw 422 when name is not a string type", async () => {
      await expect(
        service.createProduct({ code: "PRD-X", name: 123 as any, value: 10 }),
      ).rejects.toEqual({
        status: 422,
        message: "Field 'name' must be a non-empty string",
      });
    });

    it("should throw 422 when value is negative", async () => {
      await expect(
        service.createProduct({ code: "PRD-X", name: "Test", value: -5 }),
      ).rejects.toEqual({
        status: 422,
        message: "Field 'value' must be a positive number",
      });
    });

    it("should throw 422 when value is not a number", async () => {
      await expect(
        service.createProduct({
          code: "PRD-X",
          name: "Test",
          value: "abc" as any,
        }),
      ).rejects.toEqual({
        status: 422,
        message: "Field 'value' must be a positive number",
      });
    });

    it("should throw 409 when product code already exists", async () => {
      repositoryMock.findProductByCode.mockResolvedValue(mockProduct);

      await expect(
        service.createProduct({
          code: "PRD-001",
          name: "Another Product",
          value: 100,
        }),
      ).rejects.toEqual({
        status: 409,
        message: "Product code already exists",
      });
    });
  });

  describe("getAllProducts", () => {
    it("should return all products", async () => {
      repositoryMock.findAllProducts.mockResolvedValue([mockProduct]);

      const result = await service.getAllProducts();

      expect(result).toEqual([mockProduct]);
      expect(repositoryMock.findAllProducts).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no products exist", async () => {
      repositoryMock.findAllProducts.mockResolvedValue([]);

      const result = await service.getAllProducts();

      expect(result).toEqual([]);
    });
  });

  describe("getOneProductById", () => {
    it("should return a product by valid UUID", async () => {
      repositoryMock.findOneProductById.mockResolvedValue(mockProduct);

      const result = await service.getOneProductById(VALID_UUID);

      expect(result).toEqual(mockProduct);
      expect(repositoryMock.findOneProductById).toHaveBeenCalledWith(
        VALID_UUID,
      );
    });

    it("should throw 400 when ID is not a valid UUID", async () => {
      await expect(service.getOneProductById("invalid-id")).rejects.toEqual({
        status: 400,
        message: "Invalid product ID format",
      });
    });

    it("should throw 400 when ID is a number", async () => {
      await expect(service.getOneProductById("123")).rejects.toEqual({
        status: 400,
        message: "Invalid product ID format",
      });
    });

    it("should throw 404 when product is not found", async () => {
      repositoryMock.findOneProductById.mockResolvedValue(null);

      await expect(service.getOneProductById(VALID_UUID)).rejects.toEqual({
        status: 404,
        message: "Product not found",
      });
    });
  });

  describe("updateProduct", () => {
    it("should update a product successfully", async () => {
      const updatedProduct = { ...mockProduct, name: "Updated Cabinet" };
      repositoryMock.findOneProductById.mockResolvedValue(mockProduct);
      repositoryMock.updateProduct.mockResolvedValue(updatedProduct);

      const result = await service.updateProduct(VALID_UUID, {
        name: "Updated Cabinet",
      });

      expect(result.name).toBe("Updated Cabinet");
      expect(repositoryMock.updateProduct).toHaveBeenCalledWith(VALID_UUID, {
        name: "Updated Cabinet",
      });
    });

    it("should throw 400 when ID is not a valid UUID", async () => {
      await expect(
        service.updateProduct("bad-id", { name: "Test" }),
      ).rejects.toEqual({
        status: 400,
        message: "Invalid product ID format",
      });
    });

    it("should throw 404 when product does not exist", async () => {
      repositoryMock.findOneProductById.mockResolvedValue(null);

      await expect(
        service.updateProduct(VALID_UUID, { name: "Test" }),
      ).rejects.toEqual({
        status: 404,
        message: "Product not found",
      });
    });

    it("should throw 422 when body is empty", async () => {
      repositoryMock.findOneProductById.mockResolvedValue(mockProduct);

      await expect(
        service.updateProduct(VALID_UUID, {} as any),
      ).rejects.toEqual({
        status: 422,
        message: "Request body cannot be empty",
      });
    });

    it("should throw 422 when value is negative", async () => {
      repositoryMock.findOneProductById.mockResolvedValue(mockProduct);

      await expect(
        service.updateProduct(VALID_UUID, { value: -10 }),
      ).rejects.toEqual({
        status: 422,
        message: "Field 'value' must be a positive number",
      });
    });

    it("should throw 422 when name is empty string", async () => {
      repositoryMock.findOneProductById.mockResolvedValue(mockProduct);

      await expect(
        service.updateProduct(VALID_UUID, { name: "" }),
      ).rejects.toEqual({
        status: 422,
        message: "Field 'name' must be a non-empty string",
      });
    });

    it("should throw 409 when updating to a code already used by another product", async () => {
      repositoryMock.findOneProductById.mockResolvedValue(mockProduct);
      repositoryMock.findProductByCode.mockResolvedValue({
        ...mockProduct,
        id: OTHER_UUID,
        code: "PRD-EXISTING",
      });

      await expect(
        service.updateProduct(VALID_UUID, { code: "PRD-EXISTING" }),
      ).rejects.toEqual({
        status: 409,
        message: "Product code already in use by another product",
      });
    });

    it("should allow updating to the same code (own product)", async () => {
      repositoryMock.findOneProductById.mockResolvedValue(mockProduct);
      repositoryMock.findProductByCode.mockResolvedValue(mockProduct);
      repositoryMock.updateProduct.mockResolvedValue(mockProduct);

      const result = await service.updateProduct(VALID_UUID, {
        code: "PRD-001",
      });

      expect(result).toEqual(mockProduct);
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product successfully", async () => {
      repositoryMock.findOneProductById.mockResolvedValue(mockProduct);
      repositoryMock.deleteProduct.mockResolvedValue(mockProduct);

      const result = await service.deleteProduct(VALID_UUID);

      expect(result).toEqual(mockProduct);
      expect(repositoryMock.deleteProduct).toHaveBeenCalledWith(VALID_UUID);
    });

    it("should throw 400 when ID is not a valid UUID", async () => {
      await expect(service.deleteProduct("not-valid")).rejects.toEqual({
        status: 400,
        message: "Invalid product ID format",
      });
    });

    it("should throw 404 when product does not exist", async () => {
      repositoryMock.findOneProductById.mockResolvedValue(null);

      await expect(service.deleteProduct(VALID_UUID)).rejects.toEqual({
        status: 404,
        message: "Product not found",
      });
    });
  });
});
