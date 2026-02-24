import { Request, Response } from "express";
import { ProductService } from "./product.service";

export class ProductController {
  private service: ProductService;

  constructor() {
    this.service = new ProductService();
  }

  createProduct = async (req: Request, res: Response) => {
    try {
      const product = await this.service.createProduct(req.body);
      return res.status(201).json({
        message: "Product created successfully",
        data: product,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      return res.status(status).json({ error: message });
    }
  };

  getAllProducts = async (_req: Request, res: Response) => {
    try {
      const products = await this.service.getAllProducts();
      return res.status(200).json({
        message: "Products retrieved successfully",
        data: products,
      });
    } catch (error: any) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  getOneProductById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await this.service.getOneProductById(id as string);
      return res.status(200).json({
        message: "Product found successfully",
        data: product,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      return res.status(status).json({ error: message });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const product = await this.service.updateProduct(id as string, req.body);
      return res.status(200).json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      return res.status(status).json({ error: message });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.deleteProduct(id as string);
      return res.status(204).send();
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      return res.status(status).json({ error: message });
    }
  };
}
