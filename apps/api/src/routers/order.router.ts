import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";


const router = Router();
const orderController = new OrderController();
const authenticateJwt = new AuthJwtMiddleware();

router.get("/all",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt), 
    orderController.getAllOrders.bind(orderController)
);
router.get("/:order_id",
    // authenticateJwt.authenticateJwt.bind(authenticateJwt),
    // authenticateJwt.authorizeRole("USER").bind(authenticateJwt), 
    orderController.getOrderById.bind(orderController)
);

router.get("/user/:user_id",
    // authenticateJwt.authenticateJwt.bind(authenticateJwt),
    // authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    // authenticateJwt.authorizeUserId().bind(authenticateJwt),
    orderController.getUserOrders.bind(orderController)
)

router.get("/store/:store_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
    authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
    orderController.getStoreOrders.bind(orderController)
)

router.post("/address",
    // authenticateJwt.authenticateJwt.bind(authenticateJwt),
    // authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    // authenticateJwt.authorizeUserId().bind(authenticateJwt),
    orderController.changeOrderAddress.bind(orderController)
);

router.post("/method",
    // authenticateJwt.authenticateJwt.bind(authenticateJwt),
    // authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    // authenticateJwt.authorizeUserId().bind(authenticateJwt),
    orderController.changeOrderMethod.bind(orderController)
);

export default router;