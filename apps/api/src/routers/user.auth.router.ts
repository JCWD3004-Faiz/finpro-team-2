import { Router } from "express";
import { UserAuthController } from "../controllers/user.auth.controller";
import { AuthenticateJwtMiddleware } from "../middlewares/verification.middleware";

const router = Router();
const userAuthController = new UserAuthController();
const authenticateJwt = new AuthenticateJwtMiddleware();

router.post("/login", userAuthController.login.bind(userAuthController));
router.post(
  "/register",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  userAuthController.register.bind(userAuthController)
);
router.post(
  "/pending-register",
  userAuthController.pendingRegister.bind(userAuthController)
);

export default router;
