import { Request, Response } from "express";
import { ProductRawMaterialController } from "../product-raw-material.controller";
import { ProductRawMaterialService } from "../product-raw-material.service";

jest.mock("../product-raw-material.service");

describe("ProductRawMaterialController", () => {
  let controller: ProductRawMaterialController;
  let serviceMock: jest.Mocked<ProductRawMaterialService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  const VALID_UUID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

  beforeEach(() => {
    controller = new ProductRawMaterialController();
    serviceMock = (controller as any).service;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("addRawMaterialToProduct", () => {
    it("should return 201 on success", async () => {
      req = {
        body: {
          productId: VALID_UUID,
          rawMaterialId: VALID_UUID,
          requiredQuantity: 10,
        },
      };
      serviceMock.addRawMaterialToProduct.mockResolvedValue({} as any);
      await controller.addRawMaterialToProduct(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 422 for invalid data", async () => {
      req = { body: { productId: "nan" } };
      await controller.addRawMaterialToProduct(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(422);
    });

    it("should return error status from service", async () => {
      req = {
        body: {
          productId: VALID_UUID,
          rawMaterialId: VALID_UUID,
          requiredQuantity: 10,
        },
      };
      serviceMock.addRawMaterialToProduct.mockRejectedValue({
        status: 404,
        message: "Not found",
      });
      await controller.addRawMaterialToProduct(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Not found" });
    });
  });

  describe("removeRawMaterialFromProduct", () => {
    it("should return 204 on success", async () => {
      req = { params: { productId: VALID_UUID, rawMaterialId: VALID_UUID } };
      serviceMock.removeRawMaterialFromProduct.mockResolvedValue({} as any);
      await controller.removeRawMaterialFromProduct(
        req as Request,
        res as Response,
      );
      expect(res.status).toHaveBeenCalledWith(204);
    });

    it("should return 400 if params are missing", async () => {
      req = { params: { productId: VALID_UUID } }; // missing rawMaterialId
      await controller.removeRawMaterialFromProduct(
        req as Request,
        res as Response,
      );
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return error status from service on removal", async () => {
      req = { params: { productId: VALID_UUID, rawMaterialId: VALID_UUID } };
      serviceMock.removeRawMaterialFromProduct.mockRejectedValue({
        status: 404,
        message: "Not found",
      });
      await controller.removeRawMaterialFromProduct(
        req as Request,
        res as Response,
      );
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("getProductComposition", () => {
    it("should return 200 on success", async () => {
      req = { params: { productId: VALID_UUID } };
      serviceMock.getProductComposition.mockResolvedValue([]);
      await controller.getProductComposition(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 400 if productId missing", async () => {
      req = { params: {} };
      await controller.getProductComposition(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return error status from service on composition", async () => {
      req = { params: { productId: VALID_UUID } };
      serviceMock.getProductComposition.mockRejectedValue({
        status: 404,
        message: "Not found",
      });
      await controller.getProductComposition(req as Request, res as Response);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
