import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload.middleware";

const router = Router();
const profileController = new ProfileController();
const authenticateJwt = new AuthJwtMiddleware();


router.post("/address", 
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    profileController.addAddress.bind(profileController)
);

router.get("/address/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    profileController.getAddressesByUserId.bind(profileController)
);

router.post("/default",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    profileController.changeDefaultAddress.bind(profileController)
);

router.post(
    "/upload-pic",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    upload.single("image"),
    profileController.updateUserProfilePic.bind(profileController)
);

router.patch(
    "/username/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    profileController.updateUserProfile.bind(profileController)
)

router.patch(
    "/email/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    profileController.updateUserProfile.bind(profileController)
)

router.get("/cities",
    profileController.getRajaOngkirCities.bind(profileController)
);

router.get("/user/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    profileController.getUserProfile.bind(profileController)
)

router.put("/address/:user_id/:address_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    profileController.deleteAddress.bind(profileController)
)

router.post("/closest-store/",
    profileController.getClosestStore.bind(profileController)
);

router.get("/closest-store/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("USER").bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    profileController.getClosestStoreById.bind(profileController)
);

export default router;
