import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { VoucherController } from "../controllers/voucher.controller";

import { AuthJwtMiddleware } from "../middlewares/auth.middleware";


const router = Router();
const cartController = new CartController();
const voucherController = new VoucherController();
const authenticateJwt = new AuthJwtMiddleware();


router.post("/add", 
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    cartController.addToCart.bind(cartController)
);

router.post("/quantity",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    cartController.changeItemQuantity.bind(cartController)
);

router.get("/items/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    cartController.getCartItems.bind(cartController)
)

router.delete("/:user_id/:cart_item_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    cartController.removeCartItem.bind(cartController)
);

router.post("/checkout/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    cartController.checkoutCart.bind(cartController)
);

router.post("/voucher/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    voucherController.selectVoucher.bind(voucherController)
);

router.post("/redeem-product/",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    voucherController.redeemProductVoucher.bind(voucherController)
);

router.post("/redeem-cart/",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    voucherController.redeemCartVoucher.bind(voucherController)
);

router.get("/cart-vouchers/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    voucherController.getCartVouchers.bind(voucherController)
);

export default router;
