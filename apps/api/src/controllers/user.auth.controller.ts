import { Request, Response } from "express";
import { UserAuthService } from "../services/user.auth.service";
import { user } from "../models/user.models";
import { sendErrorResponse } from "../utils/response.utils";
import { extractToken, verifyToken } from "../utils/user.auth.utils";
import { EmailService } from "../services/mail.service";
import config from "../config/config";
import jwt from "jsonwebtoken";

export class UserAuthController {
  private userAuthService: UserAuthService;
  constructor() {
    this.userAuthService = new UserAuthService();
  }

  async pendingRegister(req: Request, res: Response) {
    try {
      const data: { username: string; email: string } = req.body;
      const responseData = await this.userAuthService.userPendingRegister(data);
      await EmailService.sendPasswordRegisterEmail(responseData.email);
      res.status(201).send({
        message: "Successfully registered email",
        status: res.statusCode,
        data: responseData,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to register email`, err.message);
    }
  }

  async register(req: Request, res: Response) {
    try {
      const token = extractToken(req.headers.authorization);
      const decoded = verifyToken(token, config.JWT_SECRET);
      const { email, username } = decoded
      const { password_hash, register_code } = req.body;
      await this.userAuthService.userRegister({username, email, password_hash, register_code});
      res.status(201).send({
        message: "Successfully register",
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to register user`, err.message);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, user } =
        await this.userAuthService.login(email, password);
      res.status(200).send({
        message: "Successful login",
        status: res.statusCode,
        data: {
          access_token: accessToken,
          refreshToken: refreshToken,
        },
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to login user`, err.message);
    }
  }
}
