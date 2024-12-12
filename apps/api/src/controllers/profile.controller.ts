import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service";

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
    
}
