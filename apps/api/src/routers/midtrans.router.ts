import { Router } from "express";
import MidtransController from "../controllers/midtrans.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";


const router = Router();
const midtransController = new MidtransController();
const authenticateJwt = new AuthJwtMiddleware();


router.post('/',
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    midtransController.createVABankTransfer.bind(midtransController)
)

router.put('/success/',
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    midtransController.successMidtransPaymentStatus.bind(midtransController)
)

router.put('/failed/',
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    midtransController.failedMidtransPaymentStatus.bind(midtransController)
)

router.get('/status/:transaction_id',
    midtransController.getTransactionStatus.bind(midtransController)
)

export default router;