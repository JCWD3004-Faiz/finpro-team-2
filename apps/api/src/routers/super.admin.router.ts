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

router.delete("/delete-admin/:user_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
    superAdminController.deleteStoreAdmin.bind(superAdminController)
);

router.post("/create-store",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
    superAdminController.createStore.bind(superAdminController)
);

router.get("/stores",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt), 
    superAdminController.getAllStores.bind(superAdminController)
);

router.patch("/update-store/:store_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
    superAdminController.updateStore.bind(superAdminController)
);

router.put("/delete-store/:store_id",
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt),
    superAdminController.deleteStore.bind(superAdminController)
);

export default router;