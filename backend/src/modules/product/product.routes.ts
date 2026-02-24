import { Router } from "express";
import { ProductController } from "./product.controller";

const productRoutes = Router();
const controller = new ProductController();

productRoutes.post("/", controller.createProduct);
productRoutes.get("/", controller.getAllProducts);
productRoutes.get("/:id", controller.getOneProductById);
productRoutes.put("/:id", controller.updateProduct);
productRoutes.delete("/:id", controller.deleteProduct);

export { productRoutes };
