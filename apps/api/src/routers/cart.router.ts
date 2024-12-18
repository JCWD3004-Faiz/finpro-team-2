import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";


const router = Router();
const cartController = new CartController();
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

router.get("/cart-items/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    cartController.getCartItems.bind(cartController)
)

router.delete("/remove/:user_id/:cart_item_id",
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

export default router;
