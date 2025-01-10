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

router.get(
  "/categories/all",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  categoryController.getCategories.bind(categoryController)
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
  "/",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  upload.array("images"),
  productController.createProduct.bind(productController)
);

router.patch(
  "/name/:product_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  productController.updateProduct.bind(productController)
);

router.patch(
  "/description/:product_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  productController.updateProduct.bind(productController)
);

router.patch(
  "/price/:product_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  productController.updateProduct.bind(productController)
);

router.patch(
  "/remove/:product_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  productController.deleteProduct.bind(productController)
)

router.patch(
  "/images/:image_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  upload.single("image"),
  productController.updateProductImage.bind(productController)
);

export default router;
