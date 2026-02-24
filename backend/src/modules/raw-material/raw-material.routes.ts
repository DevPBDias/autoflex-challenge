import { Router } from "express";
import { RawMaterialController } from "./raw-material.controller";

const rawMaterialRoutes = Router();
const controller = new RawMaterialController();

rawMaterialRoutes.post("/", controller.createRawMaterial);
rawMaterialRoutes.get("/", controller.getAllRawMaterials);
rawMaterialRoutes.get("/:id", controller.getOneRawMaterialById);
rawMaterialRoutes.put("/:id", controller.updateRawMaterial);
rawMaterialRoutes.delete("/:id", controller.deleteRawMaterial);

export { rawMaterialRoutes };
