import { Request, Response } from "express";
import { RawMaterialService } from "./raw-material.service";

export class RawMaterialController {
  private service: RawMaterialService;

  constructor() {
    this.service = new RawMaterialService();
  }

  createRawMaterial = async (req: Request, res: Response) => {
    try {
      const rawMaterial = await this.service.createRawMaterial(req.body);
      return res.status(201).json({
        message: "Raw material created successfully",
        rawMaterial,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      return res.status(status).json({ error: message });
    }
  };

  getAllRawMaterials = async (_req: Request, res: Response) => {
    try {
      const rawMaterials = await this.service.getAllRawMaterials();
      return res.status(200).json({
        message: "Raw materials retrieved successfully",
        rawMaterials,
      });
    } catch (error: any) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };

  getOneRawMaterialById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const rawMaterial = await this.service.getOneRawMaterialById(
        id as string,
      );
      return res.status(200).json({
        message: "Raw material found successfully",
        rawMaterial,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      return res.status(status).json({ error: message });
    }
  };

  updateRawMaterial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const rawMaterial = await this.service.updateRawMaterial(
        id as string,
        req.body,
      );
      return res.status(200).json({
        message: "Raw material updated successfully",
        rawMaterial,
      });
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      return res.status(status).json({ error: message });
    }
  };

  deleteRawMaterial = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.service.deleteRawMaterial(id as string);
      return res.status(204).send();
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      return res.status(status).json({ error: message });
    }
  };
}
