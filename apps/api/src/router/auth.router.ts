import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { validateLogin } from '../validators/auth.validator';

const router = Router();
const authService = new AuthService();
const authController = new AuthController(authService);

router.post('/login', validateLogin, authController.login.bind(authController));
router.post('/logout', authController.logout.bind(authController));

export default router;