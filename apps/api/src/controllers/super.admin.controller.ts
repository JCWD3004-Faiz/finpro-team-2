import { Request, Response } from "express";
import { SuperAdminService } from "../services/super.admin.service";

export class SuperAdminController {
  private superAdminService: SuperAdminService;

  constructor() {
    this.superAdminService = new SuperAdminService();
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


}
