import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { sendErrorResponse } from "../utils/response.utils";
import { CreateProduct } from "../models/product.models";

export class ProductController {
  private productService: ProductService;
  constructor() {
    this.productService = new ProductService();
  }

  async createProduct(req: Request, res: Response) {
    try {
      if (!req.files || !(req.files as Express.Multer.File[]).length) {
        throw new Error("No files uploaded");
      }
      const files = req.files as Express.Multer.File[];
      const product_image: string[] = files.map((file) => file.path);
      const { category_id, product_name, description, price } = req.body;
      const newProduct: CreateProduct = {
        category_id: Number(category_id),
        product_name: product_name,
        description: description,
        price: Number(price),
        product_image: product_image,
      };
      const createdProduct = await this.productService.createProduct(newProduct);
      res.status(201).send({
        message: "Successfully created a new Product",
        status: res.statusCode,
        data: createdProduct,
      });
    } catch (error) {
      sendErrorResponse(res, 400, `Failed to create new product`);
    }
  }
}
