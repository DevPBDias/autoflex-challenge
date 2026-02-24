import { Router } from "express";
import { ProductionController } from "./production.controller";

const productionRoutes = Router();
const controller = new ProductionController();

productionRoutes.get("/suggest", controller.suggestProduction);

export { productionRoutes };
