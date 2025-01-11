import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { DiscountController } from "../controllers/discount.controller";
import { CategoryController } from "../controllers/category.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const productController = new ProductController();
const discountController = new DiscountController();
const categoryController = new CategoryController();
const authenticateJwt = new AuthJwtMiddleware();

router.get(
  "/products/:store_id",
  productController.getProductsForUserByStoreId.bind(productController)
);

router.get(
  "/products/detail/:inventory_id",
  productController.getProductDetailforUser.bind(productController)
)

router.get(
  "/categories",
  categoryController.getCategories.bind(categoryController),
)

router.get(
  "/discounts/:store_id",
  discountController.getDiscountByStoreId.bind(discountController)
)

export default router;
