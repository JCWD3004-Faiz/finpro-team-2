import { Router } from "express";
import { StoreAdminController } from "../controllers/store.admin.controller";
import { DiscountController } from "../controllers/discount.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload.middleware";

const router = Router();
const storeAdminController = new StoreAdminController();
const discountController = new DiscountController();
const authenticateJwt = new AuthJwtMiddleware();

router.get(
  "/assigned-store/:user_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  storeAdminController.getStoreByUserId.bind(storeAdminController)
);

router.get(
  "/admin/:user_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeUserId().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  storeAdminController.getAdminById.bind(storeAdminController)
);

router.get(
  "/store/:store_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  storeAdminController.getStoreById.bind(storeAdminController)
);

router.post(
  "/discounts/:store_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  upload.single("image"),
  discountController.createDiscount.bind(discountController)
);

router.patch(
  "/discounts/:discount_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdminByDiscount().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  discountController.updateDiscount.bind(discountController)
);

router.patch(
  "/discounts/remove/:discount_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdminByDiscount().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  discountController.deleteDiscount.bind(discountController)
);

router.patch(
  "/discounts/image/:discount_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdminByDiscount().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  upload.single("image"),
  discountController.updateDiscountImage.bind(discountController)
)

export default router;
