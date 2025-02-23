import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { AdminService } from '../services/admin.service';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateCreateCashier, validateUpdateCashier } from '../validators/admin.validator';
import { UserRole } from '@prisma/client';

const router = Router();
const adminService = new AdminService();
const adminController = new AdminController(adminService);

router.use(authenticate);
router.use(requireRole([UserRole.admin]));

// Cashier Management
router.post('/cashiers', validateCreateCashier, adminController.createCashier.bind(adminController));
router.get('/cashiers', adminController.getCashiers.bind(adminController));
router.put('/cashiers/:id', validateUpdateCashier, adminController.updateCashier.bind(adminController));
router.delete('/cashiers/:id', adminController.deleteCashier.bind(adminController));

// Reports
router.get('/reports/daily', adminController.getDailySalesReport.bind(adminController));
router.get('/reports/products', adminController.getProductSalesReport.bind(adminController));
router.get('/reports/shifts', adminController.getShiftSalesReport.bind(adminController));
router.get('/reports/inconsistent', adminController.getInconsistentTransactions.bind(adminController));

export default router;