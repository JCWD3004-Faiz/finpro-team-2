import { Router } from "express";
import { OauthController } from "../controllers/oauth.controller";

const router = Router();
const oauthController = new OauthController();

router.get("/google", oauthController.googleLogin.bind(oauthController));
router.get("/google/callback", oauthController.googleAuthCallback.bind(oauthController));

export default router;