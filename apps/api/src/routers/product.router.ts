import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { CategoryController } from "../controllers/category.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload.middleware";

const router = Router();
const productController = new ProductController();
const categoryController = new CategoryController();
const authenticateJwt = new AuthJwtMiddleware();

//category router
router.get(
  "/categories",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  categoryController.getAllCategory.bind(categoryController)
);

router.post(
  "/categories",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  categoryController.createCategory.bind(categoryController)
);

router.patch(
  "/categories/:category_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  categoryController.updateCategory.bind(categoryController)
);

router.patch(
  "/categories/delete/:category_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  categoryController.deleteCategory.bind(categoryController)
);

//product router
router.post(
  "/create",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  upload.array("images"),
  productController.createProduct.bind(productController)
);

export default router;