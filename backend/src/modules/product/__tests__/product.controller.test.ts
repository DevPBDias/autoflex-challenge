import { Request, Response } from "express";
import { ProductController } from "../product.controller";
import { ProductService } from "../product.service";

jest.mock("../product.service");

describe("ProductController", () => {
  let controller: ProductController;
  let serviceMock: jest.Mocked<ProductService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

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
    controller = new ProductController();
    serviceMock = (controller as any).service;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("createProduct", () => {
    it("should return 201 with created product", async () => {
      req = {
        body: { code: "PRD-001", name: "Steel Cabinet", value: 1250.99 },
      };
      serviceMock.createProduct.mockResolvedValue(mockProduct);

      await controller.createProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product created successfully",
        product: mockProduct,
      });
    });

    it("should return 422 when fields are missing", async () => {
      req = { body: {} };
      serviceMock.createProduct.mockRejectedValue({
        status: 422,
        message: "Missing required fields: code, name, value",
      });

      await controller.createProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        error: "Missing required fields: code, name, value",
      });
    });

    it("should return 409 when code already exists", async () => {
      req = { body: { code: "PRD-001", name: "Dup", value: 100 } };
      serviceMock.createProduct.mockRejectedValue({
        status: 409,
        message: "Product code already exists",
      });

      await controller.createProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        error: "Product code already exists",
      });
    });

    it("should return 500 for unexpected errors", async () => {
      req = { body: { code: "PRD-X", name: "Test", value: 10 } };
      serviceMock.createProduct.mockRejectedValue(
        new Error("DB connection lost"),
      );

      await controller.createProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "DB connection lost",
      });
    });

    it("should return 500 with default message when error has no status or message", async () => {
      req = { body: { code: "PRD-X", name: "Test", value: 10 } };
      serviceMock.createProduct.mockRejectedValue({});

      await controller.createProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("getAllProducts", () => {
    it("should return 200 with list of products", async () => {
      req = {};
      serviceMock.getAllProducts.mockResolvedValue([mockProduct]);

      await controller.getAllProducts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Products retrieved successfully",
        products: [mockProduct],
      });
    });

    it("should return 200 with empty array", async () => {
      req = {};
      serviceMock.getAllProducts.mockResolvedValue([]);

      await controller.getAllProducts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Products retrieved successfully",
        products: [],
      });
    });

    it("should return 500 on unexpected error", async () => {
      req = {};
      serviceMock.getAllProducts.mockRejectedValue(new Error("fail"));

      await controller.getAllProducts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("getOneProductById", () => {
    it("should return 200 with found product", async () => {
      req = { params: { id: VALID_UUID } };
      serviceMock.getOneProductById.mockResolvedValue(mockProduct);

      await controller.getOneProductById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product found successfully",
        product: mockProduct,
      });
    });

    it("should return 400 for invalid UUID", async () => {
      req = { params: { id: "bad-id" } };
      serviceMock.getOneProductById.mockRejectedValue({
        status: 400,
        message: "Invalid product ID format",
      });

      await controller.getOneProductById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid product ID format",
      });
    });

    it("should return 404 when product is not found", async () => {
      req = { params: { id: VALID_UUID } };
      serviceMock.getOneProductById.mockRejectedValue({
        status: 404,
        message: "Product not found",
      });

      await controller.getOneProductById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Product not found",
      });
    });

    it("should return 500 with default message when error has no status or message", async () => {
      req = { params: { id: VALID_UUID } };
      serviceMock.getOneProductById.mockRejectedValue({});

      await controller.getOneProductById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("updateProduct", () => {
    it("should return 200 with updated product", async () => {
      const updated = { ...mockProduct, name: "Updated" };
      req = { params: { id: VALID_UUID }, body: { name: "Updated" } };
      serviceMock.updateProduct.mockResolvedValue(updated);

      await controller.updateProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Product updated successfully",
        product: updated,
      });
    });

    it("should return 404 when product not found", async () => {
      req = { params: { id: VALID_UUID }, body: { name: "X" } };
      serviceMock.updateProduct.mockRejectedValue({
        status: 404,
        message: "Product not found",
      });

      await controller.updateProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 422 for empty body", async () => {
      req = { params: { id: VALID_UUID }, body: {} };
      serviceMock.updateProduct.mockRejectedValue({
        status: 422,
        message: "Request body cannot be empty",
      });

      await controller.updateProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        error: "Request body cannot be empty",
      });
    });

    it("should return 409 for duplicate code", async () => {
      req = { params: { id: VALID_UUID }, body: { code: "PRD-DUP" } };
      serviceMock.updateProduct.mockRejectedValue({
        status: 409,
        message: "Product code already in use by another product",
      });

      await controller.updateProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("should return 500 with default message when error has no status or message", async () => {
      req = { params: { id: VALID_UUID }, body: { name: "Test" } };
      serviceMock.updateProduct.mockRejectedValue({});

      await controller.updateProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("deleteProduct", () => {
    it("should return 204 on successful deletion", async () => {
      req = { params: { id: VALID_UUID } };
      serviceMock.deleteProduct.mockResolvedValue(mockProduct);

      await controller.deleteProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should return 404 when product not found", async () => {
      req = { params: { id: VALID_UUID } };
      serviceMock.deleteProduct.mockRejectedValue({
        status: 404,
        message: "Product not found",
      });

      await controller.deleteProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Product not found",
      });
    });

    it("should return 400 for invalid UUID", async () => {
      req = { params: { id: "wrong" } };
      serviceMock.deleteProduct.mockRejectedValue({
        status: 400,
        message: "Invalid product ID format",
      });

      await controller.deleteProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 with default message when error has no status or message", async () => {
      req = { params: { id: VALID_UUID } };
      serviceMock.deleteProduct.mockRejectedValue({});

      await controller.deleteProduct(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });
});
