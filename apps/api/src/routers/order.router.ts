import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";
import { PaymentController } from "../controllers/payment.controller";
import { VoucherController } from "../controllers/voucher.controller";
import upload from "../middlewares/upload.middleware";

const router = Router();
const orderController = new OrderController();
const authenticateJwt = new AuthJwtMiddleware();
const paymentController = new PaymentController();
const voucherController = new VoucherController();

router.get("/all",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt), 
    orderController.getAllOrders.bind(orderController)
);

router.get("/details/:user_id/:order_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt), 
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    orderController.getOrderById.bind(orderController)
);

router.get("/user/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    orderController.getUserOrders.bind(orderController)
)

router.get("/store/:store_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
    authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
    orderController.getStoreOrders.bind(orderController)
)

router.post("/address",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    orderController.changeOrderAddress.bind(orderController)
);

router.post("/method",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    orderController.changeOrderMethod.bind(orderController)
);

router.post("/payment/:user_id/:order_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    upload.single("pop_image"),
    paymentController.createPayment.bind(paymentController)
);

router.get("/payment/:store_id/:payment_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
    authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
    paymentController.getPaymentById.bind(paymentController)
)

router.put("/payment/:store_id/:payment_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
    authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
    paymentController.changePaymentStatus.bind(paymentController)
)

router.get("/payment-history/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    paymentController.getUserPaymentHistory.bind(paymentController)
)

router.get("/payment-details/:user_id/:payment_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    paymentController.getUserPaymentDetails.bind(paymentController)
)

router.put("/process/:store_id/:order_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
    authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
    orderController.processOrder.bind(orderController)
)

router.put("/confirm/:user_id/:order_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    orderController.confirmUserOrder.bind(orderController)
)

router.put("/cancel/:user_id/:order_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    orderController.cancelUserOrder.bind(orderController)
)

router.get("/user-items/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    paymentController.getUserItemDetails.bind(paymentController)
)

router.get("/store-items/:store_id/:order_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
    authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
    paymentController.getStoreItemDetails.bind(paymentController)
)

router.post("/redeem-shipping/",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    voucherController.redeemShippingVoucher.bind(voucherController)
);

router.get("/super/:payment_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
    paymentController.getPaymentByIdSuper.bind(paymentController)
)

router.get("/super-items/:order_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
    paymentController.getSuperItemDetails.bind(paymentController)
)

export default router;
