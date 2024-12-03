import { Request, Response } from "express";
import { AdminAuthService } from "../services/admin.auth.service";
import { User } from "../models/admin.models";

export class AdminAuthController {
  private adminAuthService: AdminAuthService;

  constructor() {
    this.adminAuthService = new AdminAuthService();
  }

  async register(req: Request, res: Response) {
    try {
      const user: User = req.body;
      await this.adminAuthService.register(user);
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
}
