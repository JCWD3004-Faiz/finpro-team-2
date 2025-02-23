import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { TransactionService } from '../services/transaction.service';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateCreateTransaction } from '../validators/transaction.validator';
import { UserRole } from '@prisma/client';

const router = Router();
const transactionService = new TransactionService();
const transactionController = new TransactionController(transactionService);

router.use(authenticate);
router.use(requireRole([UserRole.cashier]));

router.post('/', validateCreateTransaction, transactionController.createTransaction.bind(transactionController));
router.get('/', transactionController.getTransactionHistory.bind(transactionController));
router.get('/:id', transactionController.getTransactionDetails.bind(transactionController));

export default router;