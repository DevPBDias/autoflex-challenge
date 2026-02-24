import { Request, Response } from "express";
import { ProductRawMaterialService } from "./product-raw-material.service";
import { AddRawMaterialToProductSchema } from "./product-raw-material.dto";

export class ProductRawMaterialController {
  private service: ProductRawMaterialService;

  constructor() {
    this.service = new ProductRawMaterialService();
  }

  addRawMaterialToProduct = async (req: Request, res: Response) => {
    try {
      const parsed = AddRawMaterialToProductSchema.safeParse(req.body);
      if (!parsed.success) {
        return res
          .status(422)
          .json({
            error: parsed.error.issues[0]?.message || "Validation error",
          });
      }

      const association = await this.service.addRawMaterialToProduct(
        parsed.data,
      );
      return res.status(201).json({
        message: "Raw material associated successfully",
        data: association,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      return res.status(status).json({ error: message });
    }
  };

  removeRawMaterialFromProduct = async (req: Request, res: Response) => {
    try {
      const { productId, rawMaterialId } = req.params;
      if (!productId || !rawMaterialId) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
      await this.service.removeRawMaterialFromProduct(
        productId as string,
        rawMaterialId as string,
      );
      return res.status(204).send();
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      return res.status(status).json({ error: message });
    }
  };

  getProductComposition = async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      if (!productId) {
        return res.status(400).json({ error: "Missing product ID" });
      }
      const composition = await this.service.getProductComposition(
        productId as string,
      );
      return res.status(200).json({
        message: "Product composition retrieved successfully",
        data: composition,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      return res.status(status).json({ error: message });
    }
  };
}
