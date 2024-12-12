import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";


const router = Router();
const profileController = new ProfileController();
const authenticateJwt = new AuthJwtMiddleware();


router.post("/address", 
    // authenticateJwt.authenticateJwt.bind(authenticateJwt),
    // authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    // authenticateJwt.authorizeUserId().bind(authenticateJwt),
    profileController.addAddress.bind(profileController)
);

router.get("/address/:user_id",
    // authenticateJwt.authenticateJwt.bind(authenticateJwt),
    // authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    // authenticateJwt.authorizeUserId().bind(authenticateJwt),
    profileController.getAddressesByUserId.bind(profileController)
);

router.post("/default",
    // authenticateJwt.authenticateJwt.bind(authenticateJwt),
    // authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    // authenticateJwt.authorizeUserId().bind(authenticateJwt),
    profileController.changeDefaultAddress.bind(profileController)
);

export default router;
