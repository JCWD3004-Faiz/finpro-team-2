import { Request, Response, NextFunction } from "express";
import environment from "dotenv";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

environment.config();

export class AuthJwtMiddleware {

    private prisma: PrismaClient;

    constructor() {
      this.prisma = new PrismaClient();
    }


    authenticateJwt(req: Request, res: Response, next: NextFunction): void {
        const token = req.headers.authorization?.split(" ")[1] as string;
        if (!token) {
            res.status(401).send({
                message: "Access token is missing or invalid",
                status: res.statusCode,
            });
            return
        }
        jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
            if (err) return res.status(401).send({ message: "Invalid token", status: res.statusCode });
            (req as any).user = user;
            next();
        });
    }

    authorizeRole(roles: string): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction): void => {
            if (!roles.includes((req as any).user.role)) {
                res.status(403).send({
                    message: "Forbidden",
                    status: res.statusCode,
                });
                return
            }
            next();
        };
    }

    authorizeUserId(): (req: Request, res: Response, next: NextFunction) => void {
        return (req: Request, res: Response, next: NextFunction): void => {
            const user_id = (req as any).user.id;
            const resourceId = req.params.user_id || req.body.user_id;
            if (String(user_id) !== String(resourceId)) {
                res.status(403).send({
                    message: "Forbidden: You can only access your own resources",
                    status: res.statusCode,
                });
                return
            }
            next();
        };
    }

    authorizeStoreAdmin(): (req: Request, res: Response, next: NextFunction) => void {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const storeId = parseInt(req.params.store_id || req.body.store_id); 
            const user_id = (req as any).user.id;
            const store = await this.prisma.stores.findUnique({ where: { store_id: storeId } });
            if (!store || store.user_id !== user_id) {
                res.status(403).send({
                    message: "Forbidden: You can only access stores associated with your account",
                    status: res.statusCode,
                });
                return
            }
            next();
        };
    }

    authorizeStoreAdminByInventory(): (req: Request, res: Response, next: NextFunction) => void {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
            const inventoryId = parseInt(req.params.inventory_id, 10);
            const userId = (req as any).user.id;
            const inventory = await this.prisma.inventories.findUnique({
                where: { inventory_id: inventoryId },
                include: { Store: true }, 
            });
            if (!inventory || inventory.Store.user_id !== userId) {
                res.status(403).send({
                  message: "Forbidden: You can only access inventories associated with your account",
                  status: res.statusCode,
                });
                return;
            }
        
            next();
        }
    }
    
}
