import { Request, Response } from "express";
import { UserProfileService } from "../services/user.profile.service";
import { sendErrorResponse } from "../utils/response.utils";
import { extractToken, verifyTokenResetPassword, verifyTokenUserId } from "../utils/user.auth.utils";
import config from "../config/config";

export class UserProfileController {
  private userProfileService: UserProfileService;
  constructor() {
    this.userProfileService = new UserProfileService();
  }

  async updateUserProfilePic(req: Request, res: Response) {
    try {
      if (!req.file) {
        throw new Error("no file uploaded");
      }
      const image: string = (req as any).file?.path || "";
      
      const token = extractToken(req.headers.authorization);
      const decoded = verifyTokenUserId(token, config.JWT_SECRET);
      const {id} = decoded;
      const data = {id, image};
      await this.userProfileService.updateUserProfilePic(data);
      res.status(201).send({
        message: "Successfully updated profile picture",
        status: res.statusCode,
      });
    } catch (error) {
        const err = error as Error;
        sendErrorResponse(res, 400, `Failed to update profile picture`, err.message);
    }
  }
}
