import { Request, Response } from "express";
import { ProductionService } from "./production.service";

export class ProductionController {
  private service: ProductionService;

  constructor() {
    this.service = new ProductionService();
  }

  suggestProduction = async (_req: Request, res: Response) => {
    try {
      const suggestion = await this.service.suggestProduction();
      return res.status(200).json({
        message: "Production suggestion calculated successfully",
        data: suggestion,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      return res.status(status).json({ error: message });
    }
  };
}
