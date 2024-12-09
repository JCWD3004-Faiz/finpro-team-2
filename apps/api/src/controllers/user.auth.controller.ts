import { Request, Response } from "express";
import { UserAuthService } from "../services/user.auth.service";
import { user } from "../models/user.models";
import { sendErrorResponse } from "../utils/response.utils";
import { extractToken, verifyToken, verifyTokenResetPassword } from "../utils/user.auth.utils";
import { EmailService } from "../services/mail.service";
import config from "../config/config";
import jwt from "jsonwebtoken";
import { SendEmailService } from "../services/sendMail.service";

export class UserAuthController {
  private userAuthService: UserAuthService;
  private sendEmailService: SendEmailService;
  constructor() {
    this.userAuthService = new UserAuthService();
    this.sendEmailService = new SendEmailService();
  }

  async sendResetPassword(req: Request, res: Response){
    try {
      const {email} = req.body;
      const responseData = await this.sendEmailService.sendResetPasswordEmail(email);
      await EmailService.sendPasswordResetEmail(responseData.email);
      res.status(201).send({
        message: "Successfully sent reset password email",
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to reset password`, err.message);
    }
  }

  async resetPassword(req: Request, res: Response){
    try {
      const token = extractToken(req.headers.authorization);
      const decoded = verifyTokenResetPassword(token, config.JWT_SECRET);
      const { email } = decoded
      const { password } = req.body;
      await this.userAuthService.resetPassword(email, password);
      res.status(201).send({
        message: "Successfully reset password",
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to reset password`, err.message);
    }
  }

  async pendingRegister(req: Request, res: Response) {
    try {
      const data: { username: string; email: string } = req.body;
      const responseData = await this.sendEmailService.userPendingRegister(data);
      await EmailService.sendPasswordRegisterEmail(responseData.email);
      res.status(201).send({
        message: "Successfully sent verification email",
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

  async sendVerificationEmail(req: Request, res: Response) {
    try {
      const data: { username: string; email: string } = req.body;
      const responseData = await this.sendEmailService.sendVerifyEmail(data);
      await EmailService.sendPasswordRegisterEmail(responseData.email);
      res.status(201).send({
        message: "Successfully sent verification email",
        status: res.statusCode,
        data: responseData,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to register email`, err.message);
    }
  }

  async emailVerification(req: Request, res: Response){
    try {
      const token = extractToken(req.headers.authorization);
      const decoded = verifyToken(token, config.JWT_SECRET);
      const { email, username } = decoded
      await this.userAuthService.verifyEmail({username, email})
      res.status(201).send({
        message: "Successfully verify email",
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to verify email`, err.message);
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
