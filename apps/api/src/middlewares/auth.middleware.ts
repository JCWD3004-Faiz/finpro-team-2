import { Request, Response, NextFunction } from "express";
import environment from "dotenv";
import jwt from "jsonwebtoken";

environment.config();

export class AuthJwtMiddleware {
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
            const userId = (req as any).user.id;
            const resourceId = req.params.userId || req.body.userId;
            if (String(userId) !== String(resourceId)) {
                res.status(403).send({
                    message: "Forbidden: You can only access your own resources",
                    status: res.statusCode,
                });
                return
            }
            next();
        };
    }
}
