import {Router} from "express"
import { StoreAdminController } from "../controllers/store.admin.controller";
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";


const router = Router()
const storeAdminController = new StoreAdminController()
const authenticateJwt = new AuthJwtMiddleware();

router.get("/assigned-store/:user_id", 
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt), 
    storeAdminController.getStoreByUserId.bind(storeAdminController)
);

router.get("/admin/:user_id", 
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeUserId().bind(authenticateJwt),
    authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt),
    storeAdminController.getAdminById.bind(storeAdminController)
);

router.get("/store/:store_id", 
    authenticateJwt.authenticateJwt.bind(authenticateJwt),
    authenticateJwt.authorizeStoreAdmin().bind(authenticateJwt),
    authenticateJwt.authorizeRole("STORE_ADMIN").bind(authenticateJwt), 
    storeAdminController.getStoreById.bind(storeAdminController)
);

export default router;