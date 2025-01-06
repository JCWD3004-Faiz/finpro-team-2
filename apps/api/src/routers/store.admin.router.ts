import { Router } from "express";
import { StoreAdminController } from "../controllers/store.admin.controller";
import { DiscountController } from "../controllers/discount.controller";
import { InventoryController } from "../controllers/inventory.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload.middleware";

const router = Router();
const storeAdminController = new StoreAdminController();
const discountController = new DiscountController();
const inventoryController = new InventoryController();
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

//discounts router
router.get(
  "/discounts/:store_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  discountController.getDiscountsForAdmin.bind(discountController)
);

router.get(
  "/discounts/details/:discount_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdminByDiscount().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  discountController.getDiscountDetail.bind(discountController)
)

router.post(
  "/discounts/:store_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  upload.single("image"),
  discountController.createDiscount.bind(discountController)
);

//update discount value
router.patch(
  "/discounts/value/:discount_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdminByDiscount().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  discountController.updateDiscount.bind(discountController)
);

//update discount start date
router.patch(
  "/discounts/start/:discount_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdminByDiscount().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  discountController.updateDiscount.bind(discountController)
);

//update discount end date
router.patch(
  "/discounts/end/:discount_id",
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
);

router.get(
  "/inventories/:store_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  inventoryController.getInventoryWithProductNameByStoreId.bind(
    inventoryController
  )
);

router.get("/inventories/discounts/:store_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
  authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
  inventoryController.getInventoryforDiscountByStoreId.bind(
    inventoryController
  ))

export default router;
