import { Request, Response } from "express";
import { StoreAdminService } from "../services/store.admin.service";


export class StoreAdminController {
    private storeAdminService: StoreAdminService;

    constructor() {
        this.storeAdminService = new StoreAdminService();;
    }

    async getStoreByUserId(req: Request, res: Response) {
        const user_id = parseInt(req.params.user_id);
        const data = await this.storeAdminService.getStoreByUserId(user_id);
        if (data) {
            res.status(200).send({
              data: data, message: "Store successfully retrieved",
              status: res.statusCode,
            });
        } else {
            res.status(404).send({
              message: `No store is assigned to admin with id:${user_id}`,
              status: res.statusCode,
            });
        }
    }

    async getAdminById(req: Request, res: Response) {
        const user_id = parseInt(req.params.user_id);
        const data = await this.storeAdminService.getAdminById(user_id);
        if (data) {
            res.status(200).send({
              data: data, message: "Admin successfully retrieved",
              status: res.statusCode,
            });
        } else {
            res.status(404).send({
              message: `Admin with id:${user_id} is not found`,
              status: res.statusCode,
            });
        }
    }

    async getStoreById(req: Request, res: Response) {
        const store_id = parseInt(req.params.store_id);
        const data = await this.storeAdminService.getStoreById(store_id);
        if (data) {
            res.status(200).send({
              data: data, message: "Store successfully retrieved",
              status: res.statusCode,
            });
        } else {
            res.status(404).send({
              message: `No store with id:${store_id} not found`,
              status: res.statusCode,
            });
        }
    }
}
