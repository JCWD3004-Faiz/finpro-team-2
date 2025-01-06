import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service";
import { sendErrorResponse } from "../utils/response.utils";
import { extractToken, verifyTokenUserId } from "../utils/user.auth.utils";
import config from "../config/config";

export class ProfileController {
    private profileService: ProfileService;

    constructor() {
        this.profileService = new ProfileService();
    }

    async addAddress(req: Request, res: Response): Promise<void> {
        const { user_id, address, city_name, city_id } = req.body;
        const data:any = await this.profileService.addAdress(user_id, address, city_name, city_id);
        if (data && !data.error) {
            res.status(200).send({
                message: "Successfully added address", data: data,
                status: res.statusCode
            });
        } else {
            res.status(400).send({
                message: data?.error || "Failed to add address",
                status: res.statusCode,
            });
        }
    }

    async getAddressesByUserId(req: Request, res: Response): Promise<void> {
        const  user_id  = parseInt(req.params.user_id);
        const data: any = await this.profileService.getAddressesByUserId(user_id);
        if (data &&!data.error) {
            res.status(200).send({
                message: "Addresses retrieved successfully", data: data,
                status: res.statusCode
            });
        } else {
            res.status(400).send({
                message: data?.error || "Failed to retrieve addresses",
                status: res.statusCode,
            });
        }
    }

    async changeDefaultAddress(req: Request, res: Response): Promise<void> {
        const { user_id, new_address_id,  } = req.body;
        const data:any = await this.profileService.changeDefaultAddress(user_id, new_address_id);
        if (data &&!data.error) {
          res.status(200).send({
            message: "Default address successfully changed.",
            status: res.statusCode,
          });
        } else {
          res.status(400).send({
            message: "Failed to change default address.",
            status: res.statusCode,
          });
        }
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
          await this.profileService.updateUserProfilePic(data);
          res.status(201).send({
            message: "Successfully updated profile picture",
            status: res.statusCode,
          });
        } catch (error) {
            const err = error as Error;
            sendErrorResponse(res, 400, `Failed to update profile picture`, err.message);
        }
    }

    async getRajaOngkirCities(req: Request, res: Response) {
        const data = await this.profileService.getRajaOngkirCities();
        if (data &&!data.error) {
            res.status(200).send({
              message: "RajaOngkir cities retrieved successfully",
              status: res.statusCode, data: data
            });
        } else {
            res.status(400).send({
              message: "Failed to change retrieve RajaOngkir cities",
              status: res.statusCode,
            });
        }
    }

    async getUserProfile(req: Request, res: Response) {
      const user_id = parseInt(req.params.user_id);
      const data = await this.profileService.getUserProfile(user_id);
      if (data) {
        res.status(200).send({
          message: "User profile retrieved successfully",
          status: res.statusCode, data: data
        });
      } else {
        res.status(400).send({
          message: "Failed to retrieve user profile",
          status: res.statusCode,
        });
      }
    }
    
}
