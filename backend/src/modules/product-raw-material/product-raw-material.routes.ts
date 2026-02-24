import { Router } from "express";
import { ProductRawMaterialController } from "./product-raw-material.controller";

const productRawMaterialRoutes = Router();
const controller = new ProductRawMaterialController();

productRawMaterialRoutes.post("/", controller.addRawMaterialToProduct);
productRawMaterialRoutes.get("/:productId", controller.getProductComposition);
productRawMaterialRoutes.delete(
  "/:productId/:rawMaterialId",
  controller.removeRawMaterialFromProduct,
);

export { productRawMaterialRoutes };
