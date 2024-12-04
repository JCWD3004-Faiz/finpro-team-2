import {Router} from "express"
import {AdminAuthController} from "../controllers/admin.auth.controller"
import { AuthJwtMiddleware } from "../middlewares/auth.middleware";


const router = Router()
const adminAuthController = new AdminAuthController()
const authenticateJwt = new AuthJwtMiddleware();


router.post("/register", 
    // authenticateJwt.authenticateJwt.bind(authenticateJwt),
    // authenticateJwt.authorizeRole("SUPER_ADMIN").bind(authenticateJwt), 
    adminAuthController.register.bind(adminAuthController)
);

export default router;