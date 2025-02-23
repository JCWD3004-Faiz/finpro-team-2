import { Router } from 'express';
import { ShiftController } from '../controllers/shift.controller';
import { ShiftService } from '../services/shift.service';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { validateStartShift, validateEndShift } from '../validators/shift.validator';
import { UserRole } from '@prisma/client';

const router = Router();
const shiftService = new ShiftService();
const shiftController = new ShiftController(shiftService);

router.use(authenticate);
router.use(requireRole([UserRole.cashier]));

router.post('/start', validateStartShift, shiftController.startShift.bind(shiftController));
router.post('/end', validateEndShift, shiftController.endShift.bind(shiftController));
router.get('/current', shiftController.getCurrentShift.bind(shiftController));
router.get('/history', shiftController.getShiftHistory.bind(shiftController));

export default router;