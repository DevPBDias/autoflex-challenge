import { Router } from "express";
import { productRoutes } from "../modules/product/product.routes";
import { rawMaterialRoutes } from "../modules/raw-material/raw-material.routes";
import { productRawMaterialRoutes } from "../modules/product-raw-material/product-raw-material.routes";
import { productionRoutes } from "../modules/production/production.routes";

const routes = Router();

routes.use("/products", productRoutes);
routes.use("/raw-materials", rawMaterialRoutes);
routes.use("/product-raw-materials", productRawMaterialRoutes);
routes.use("/production", productionRoutes);

export default routes;
