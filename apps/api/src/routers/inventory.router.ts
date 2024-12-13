import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const inventoryController = new InventoryController();
const authenticateJwt = new AuthJwtMiddleware();

router.post(
  "/stock-journal/:inventory_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  inventoryController.superAdminUpdateStock.bind(inventoryController)
);

router.post(
  "/stock/:inventory_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdminByInventory().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  inventoryController.storeAdminUpdateStock.bind(inventoryController)
);



export default router;
