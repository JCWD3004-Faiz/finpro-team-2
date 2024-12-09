import { Request, Response } from "express";
import { OauthService } from "../services/oauth.service";
import { sendErrorResponse } from "../utils/response.utils";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import config from "../config/config";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/user.auth.utils";

const prisma = new PrismaClient();

export class OauthController {
  private oauthService: OauthService;
  constructor() {
    this.oauthService = new OauthService();
  }

  async googleLogin(req: Request, res: Response): Promise<void> {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res);
  }

  async googleAuthCallback(req: Request, res: Response): Promise<void> {
    passport.authenticate("google", async (err: any, user: any, info: any) => {
      if (err) {
        sendErrorResponse(res, 500, "Authentication Failed", err.message);
        return;
      }
      if (!user) {
        sendErrorResponse(res, 401, "Authentication failed");
        return;
      }
      try {
        const savedUser = await this.oauthService.findOrCreateUser({
          email: user.email,
          displayName: user.displayName,
          providerUserId: user.id,
        });
        const {accessToken, refreshToken} = generateTokens({
          user_id: savedUser.user_id,
          role: savedUser.role,
          is_verified: savedUser.is_verified,
        });
        
        await this.oauthService.updateRefreshToken(savedUser.email, refreshToken);

        res.status(200).json({
            message: "Authentication successful",
            user: savedUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
      } catch (error) {
        const err = error as Error
        sendErrorResponse(res, 500, "Error during authentication", err.message);
      }
    })(req, res);
  }
}
