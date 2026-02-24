import { Request, Response } from "express";
import { RawMaterialController } from "../raw-material.controller";
import { RawMaterialService } from "../raw-material.service";

jest.mock("../raw-material.service");

describe("RawMaterialController", () => {
  let controller: RawMaterialController;
  let serviceMock: jest.Mocked<RawMaterialService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    controller = new RawMaterialController();
    serviceMock = (controller as any).service;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  it("createRawMaterial should return 201", async () => {
    req = { body: {} };
    serviceMock.createRawMaterial.mockResolvedValue({ id: "1" } as any);
    await controller.createRawMaterial(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("createRawMaterial should return 500 on unexpected error", async () => {
    req = { body: {} };
    serviceMock.createRawMaterial.mockRejectedValue(new Error("fail"));
    await controller.createRawMaterial(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("createRawMaterial should return 422 if service throws status", async () => {
    req = { body: {} };
    serviceMock.createRawMaterial.mockRejectedValue({
      status: 422,
      message: "err",
    });
    await controller.createRawMaterial(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(422);
  });

  it("getAllRawMaterials should return 200", async () => {
    req = {};
    serviceMock.getAllRawMaterials.mockResolvedValue([]);
    await controller.getAllRawMaterials(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getAllRawMaterials should return 500 on error", async () => {
    req = {};
    serviceMock.getAllRawMaterials.mockRejectedValue(new Error());
    await controller.getAllRawMaterials(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("getOneRawMaterialById should return 200", async () => {
    req = { params: { id: "1" } };
    serviceMock.getOneRawMaterialById.mockResolvedValue({} as any);
    await controller.getOneRawMaterialById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("getOneRawMaterialById should return 500 on unexpected error", async () => {
    req = { params: { id: "1" } };
    serviceMock.getOneRawMaterialById.mockRejectedValue({});
    await controller.getOneRawMaterialById(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("updateRawMaterial should return 200", async () => {
    req = { params: { id: "1" }, body: {} };
    serviceMock.updateRawMaterial.mockResolvedValue({} as any);
    await controller.updateRawMaterial(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("updateRawMaterial should return 500 on unexpected error", async () => {
    req = { params: { id: "1" }, body: {} };
    serviceMock.updateRawMaterial.mockRejectedValue({});
    await controller.updateRawMaterial(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("deleteRawMaterial should return 204", async () => {
    req = { params: { id: "1" } };
    serviceMock.deleteRawMaterial.mockResolvedValue({} as any);
    await controller.deleteRawMaterial(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("deleteRawMaterial should return 500 on unexpected error", async () => {
    req = { params: { id: "1" } };
    serviceMock.deleteRawMaterial.mockRejectedValue({});
    await controller.deleteRawMaterial(req as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
