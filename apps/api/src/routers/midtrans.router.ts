import { Router } from "express";
import MidtransController from "../controllers/midtrans.controller";

const router = Router();
const midtransController = new MidtransController();

router.post('/', midtransController.createVABankTransfer.bind(midtransController)) 

router.get('/status/:orderId', midtransController.getTransactionStatus.bind(midtransController))

export default router;