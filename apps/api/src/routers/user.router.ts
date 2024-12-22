import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const productController = new ProductController();
const authenticateJwt = new AuthJwtMiddleware();

router.get(
  "/products/:store_id",
  productController.getProductsForUserByStoreId.bind(productController)
);

router.get(
  "/products/detail/:inventory_id",
  productController.getProductDetailforUser.bind(productController)
)

export default router;