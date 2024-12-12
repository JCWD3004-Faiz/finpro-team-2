import { Router } from "express";
import { UserProfileController } from "../controllers/user.profile.controller";
import { AuthenticateJwtMiddleware } from "../middlewares/verification.middleware";
import upload from "../middlewares/upload.middleware";

const router = Router();
const userProfileController = new UserProfileController();
const authenticateJwt = new AuthenticateJwtMiddleware();

router.post(
  "/upload-pic",
  authenticateJwt.authenticateJwt.bind(authenticateJwt),
  upload.single("image"),
  userProfileController.updateUserProfilePic.bind(userProfileController)
);

export default router;          
