import { Request, Response } from "express";
import { ProductionController } from "../production.controller";
import { ProductionService } from "../production.service";

jest.mock("../production.service");

describe("ProductionController", () => {
  let controller: ProductionController;
  let serviceMock: jest.Mocked<ProductionService>;
  let res: Partial<Response>;

  beforeEach(() => {
    controller = new ProductionController();
    serviceMock = (controller as any).service;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  it("should return 200 with suggestion", async () => {
    serviceMock.suggestProduction.mockResolvedValue({
      suggestedProduction: [],
      totalEstimatedValue: 0,
    });
    await controller.suggestProduction({} as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return 500 on unexpected error", async () => {
    serviceMock.suggestProduction.mockRejectedValue(new Error("fail"));
    await controller.suggestProduction({} as Request, res as Response);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
