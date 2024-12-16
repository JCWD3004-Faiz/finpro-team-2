import {Router} from "express"
import {SuperAdminController} from "../controllers/super.admin.controller"
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";


const router = Router()
const superAdminController = new SuperAdminController()
const authenticateJwt = new AuthJwtMiddleware();

router.post("/register", 
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt), 
    superAdminController.registerAdmin.bind(superAdminController)
);

router.get("/store-admin", 
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt), 
    superAdminController.getAllStoreAdmins.bind(superAdminController)
);

router.post("/assign",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
    superAdminController.assignStoreAdmin.bind(superAdminController)
);

router.get("/store/:id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
    superAdminController.getStoreByStoreId.bind(superAdminController),
)

export default router;