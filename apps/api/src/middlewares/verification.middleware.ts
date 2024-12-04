import { Request, Response, NextFunction, RequestHandler } from "express";
import environment from "dotenv";
import jwt from "jsonwebtoken";

environment.config();

export class AuthenticateJwtMiddleware {
  authenticateJwt(req: Request, res: Response, next: NextFunction): any {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return res.status(401).send({
          message: "Authorization header is missing",
          status: res.statusCode,
        });
      }

      const token = authorizationHeader.split(" ")[1];
      if (!token) {
        return res.status(401).send({
          message: "Access token is missing or invalid",
          status: res.statusCode,
        });
      }

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        console.error("JWT_SECRET is not defined in environment variables");
        return res.status(500).send({
          message: "Internal server error",
          status: res.statusCode,
        });
      }

      jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
          return res.status(401).send({
            message: "Invalid token",
            status: res.statusCode,
          });
        } else {
          (req as any).user = user;
          next();
        }
      });
    } catch (error) {
      console.error("Internal server error:", error);
      return res.status(500).send({
        message: "Internal server error",
        status: res.statusCode,
      });
    }
  }
}
