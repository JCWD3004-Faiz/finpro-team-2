import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { sendErrorResponse } from "../utils/response.utils";

export class CategoryController {
  private categoryService: CategoryService;
  constructor() {
    this.categoryService = new CategoryService();
  }

  async getAllCategory(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = (req.query.search as string) || "";
      const categories = await this.categoryService.getAllCategory(
        page,
        pageSize,
        search
      );
      res.status(201).send({
        message: "Get categories successfull",
        status: res.statusCode,
        data: categories
      });
    } catch (error) {
        sendErrorResponse(res, 404, `Failed to get categories`);
    }
  }

  async createCategory(req: Request, res: Response){
    try {
        const {category_name} = req.body;
        await this.categoryService.createCategory(category_name);
        res.status(201).send({
            message: "create category successfull",
            status: res.statusCode,
        });
    } catch (error) {
        sendErrorResponse(res, 400, `Failed to create a new category`);
    }
  }

  async updateCategory(req: Request, res: Response){
    try {
        const category_id = parseInt(req.params.category_id);
        const {category_name} = req.body;
        await this.categoryService.updateCategory(category_id, category_name);
        res.status(201).send({
            message: "Update category successfull",
            status: res.statusCode,
        });
    } catch (error) {
        sendErrorResponse(res, 400, `Failed to update the category`);
    }
  }

  async deleteCategory(req: Request, res: Response){
    try {
        const category_id = parseInt(req.params.category_id);
        await this.categoryService.deleteCategory(category_id);
        res.status(201).send({
            message: "category deleted successfully",
            status: res.statusCode,
        });
    } catch (error) {
        sendErrorResponse(res, 400, `Failed to delete the category`);
    }
  }
}