import { Router } from "express";
import { SuperAdminController } from "../controllers/super.admin.controller";

import { VoucherController } from "../controllers/voucher.controller";

import { ProductController } from "../controllers/product.controller";

import { SalesController } from "../controllers/sales.controller";

import { StockController } from "../controllers/stock.controller";

import { AuthJwtMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const superAdminController = new SuperAdminController();

const voucherController = new VoucherController();

const productController = new ProductController();

const salesController = new SalesController();

const stockController = new StockController();

const authenticateJwt = new AuthJwtMiddleware();

router.post(
  "/register",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.registerAdmin.bind(superAdminController)
);

router.get(
  "/store-admin",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.getAllStoreAdmins.bind(superAdminController)
);

router.post(
  "/assign",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.assignStoreAdmin.bind(superAdminController)
);

router.get(
  "/store/:id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.getStoreByStoreId.bind(superAdminController)
);

router.delete(
  "/admin/:user_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.deleteStoreAdmin.bind(superAdminController)
);

router.post(
  "/store",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.createStore.bind(superAdminController)
);

router.get(
  "/stores",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.getAllStores.bind(superAdminController)
);

router.patch(
  "/store/:store_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.updateStore.bind(superAdminController)
);

router.put(
  "/store/:store_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.deleteStore.bind(superAdminController)
);


router.post(
  "/voucher",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  voucherController.createVoucher.bind(voucherController)
);

router.get(
  "/vouchers",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  voucherController.getAllVouchers.bind(voucherController)
)

router.patch(
  "/voucher/:voucher_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  voucherController.editVoucher.bind(voucherController)
);

router.put(
  "/voucher/:voucher_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  voucherController.deleteVoucher.bind(voucherController)
)

router.post(
  "/gift-voucher/:voucher_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  voucherController.giftVoucher.bind(voucherController)
)

router.get(
  "/products",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  productController.getProductsForSuperAdmin.bind(productController)
)

router.get(
  "/products/details/:product_id",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  productController.getProductDetailforSuperAdmin.bind(productController)
)

router.get(
  "/store-names",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.getStoreNames.bind(superAdminController)
)

router.get(
  "/sales",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  salesController.getMonthlySalesReport.bind(salesController)
)

router.get(
  "/sales/categories",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  salesController.getMonthlySalesByCategory.bind(salesController)
)

router.get(
  "/sales/Products",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  salesController.getMonthlySalesByProduct.bind(salesController)
)

router.get(
  "/data/all",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  salesController.getCategoryProductStoreName.bind(salesController)
)

router.get(
  "/stocks",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  stockController.getStockJournalByStoreId.bind(stockController),
)

router.get(
  "/users",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
  superAdminController.getAllUsers.bind(superAdminController),
)

export default router;
