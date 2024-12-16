import { Request, Response } from "express";
import { SuperAdminService } from "../services/super.admin.service";
import { User } from "../models/admin.models";
import { sendErrorResponse } from "../utils/response.utils";


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
    const data = await this.superAdminService.getAllStoreAdmins();
    if (data) {
      res.status(200).send ({
        data: data,
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
    const { store_id, user_id } = req.body;
    const data = await this.superAdminService.assignStoreAdmin(store_id, user_id);
    if (data) {
      res.status(200).send({
        message: "Store Admin successfully assigned.",
        status: res.statusCode,
      });
    } else {
      res.status(400).send({
        message: "Failed to assign Store Admin.",
        status: res.statusCode,
      });
    }
  }


  async getStoreByStoreId(req: Request, res: Response){
    try {
      const storeId = parseInt(req.params.id);
      const store = await this.superAdminService.getStoreByStoreId(storeId);
      res.status(200).send({
        message: "Store found",
        status: res.statusCode,
        data: store
      });
    } catch (error) {
      const err = error as Error
      sendErrorResponse(res, 400, `Failed to get store with the store ID`, err.message);
    }
  }

  async deleteStoreAdmin(req: Request, res: Response): Promise<void> {
    const user_id = parseInt(req.params.user_id);
    const data = await this.superAdminService.deleteStoreAdmin(user_id);
    if (data && !data.error) {
      res.status(200).send({
        message: "Store Admin successfully deleted.",
        status: res.statusCode,
      });
    } else {
      res.status(404).send({
        message: "Unable to delete Store Admin",
        status: res.statusCode,
      });
    }
  }

  async createStore(req: Request, res: Response): Promise<void> {
    const { store_name, store_location, city_id } = req.body;
    const data = await this.superAdminService.createStore(store_name, store_location, city_id);
    if (data) {
      res.status(201).send({
        message: "Store successfully created.",
        status: res.statusCode,
      });
    } else {
      res.status(400).send({
        message: "Failed to create Store.",
        status: res.statusCode,
      });
    }
  }

  async getAllStores(req: Request, res: Response){
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const sortField = (req.query.sortField as string) || "stock";
    const sortOrder = (req.query.sortOrder as string) || "asc";
    const search = (req.query.search as string) || "";
    const order = await this.superAdminService.getAllStores(
      page,
      pageSize,
      sortField as "admin" | "created_at",
      sortOrder as "asc" | "desc",
      search
    );
    if (order) {
      res.status(200).send ({
        data: order,
        status: res.statusCode,
      });
    } else {
      res.status(404).send({
        message: "Stores not found",
        status: res.statusCode,
        details: res.statusMessage,
      });
    }
  }

  async updateStore(req: Request, res: Response): Promise<void> {
    const store_id = parseInt(req.params.store_id);
    const {store_name, store_location, city_id } = req.body;
    const data = await this.superAdminService.updateStore(store_id, store_name, store_location, city_id);
    if (data) {
      res.status(200).send({
        message: "Store successfully updated.",
        status: res.statusCode,
      });
    } else {
      res.status(404).send({
        message: "Unable to update Store",
        status: res.statusCode,
      });
    }
  }

  async deleteStore(req: Request, res: Response): Promise<void> {
    const store_id = parseInt(req.params.store_id);
    const data = await this.superAdminService.deleteStore(store_id);
    if (data) {
      res.status(200).send({
        message: "Store successfully deleted.",
        status: res.statusCode,
      });
    } else {
      res.status(404).send({
        message: "Unable to delete store",
        status: res.statusCode,
      });

    }
  }

}
