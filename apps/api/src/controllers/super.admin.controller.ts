import { Request, Response } from "express";
import { SuperAdminService } from "../services/super.admin.service";
import { User } from "../models/admin.models";


export class SuperAdminController {
  private superAdminService: SuperAdminService;

  constructor() {
    this.superAdminService = new SuperAdminService();
  }

  async registerAdmin(req: Request, res: Response) {
    try {
      const user: User = req.body;
      await this.superAdminService.registerAdmin(user);
      res.status(201).send({
        message: "Store Admin successfully registered",
        status: res.statusCode,
      });
    } catch (error) {
      res.status(400).send({
        message: `Failed to register Store Admin. Please try again later`,
        status: res.statusCode,
      });
    }
  }

  async getAllStoreAdmins(req: Request, res: Response){
    const event = await this.superAdminService.getAllStoreAdmins();
    if (event) {
      res.status(200).send ({
        data: event,
        status: res.statusCode,
      });
    } else {
      res.status(404).send({
        message: "Store admin not found",
        status: res.statusCode,
        details: res.statusMessage,
      });
    }
  }

  async assignStoreAdmin(req: Request, res: Response): Promise<void> {
    try {
      const { store_id, user_id } = req.body;
      const result = await this.superAdminService.assignStoreAdmin(store_id, user_id);
      res.status(200).send({
        message: "Store Admin successfully assigned.",
        data: result,
        status: res.statusCode,
      });
    } catch (error:any) {
      res.status(400).send({
        message: `Failed to assign Store Admin. ${error.message}`,
        status: res.statusCode,
      });
    }
  }

}
