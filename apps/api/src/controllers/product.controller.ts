import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { GetProductService } from "../services/product.get.service";
import {
  sendErrorResponse,
  sendZodErrorResponse,
} from "../utils/response.utils";
import { CreateProduct, UpdateProduct } from "../models/product.models";
import { ZodError } from "zod";

export class ProductController {
  private productService: ProductService;
  private getProductService: GetProductService;
  constructor() {
    this.productService = new ProductService();
    this.getProductService = new GetProductService();
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
      const createdProduct =
        await this.productService.createProduct(newProduct);
      res.status(201).send({
        message: "Successfully created a new Product",
        status: res.statusCode,
        data: createdProduct,
      });
    } catch (error) {
      const err = error as Error;
      if (error instanceof ZodError) {
        sendZodErrorResponse(res, error);
      } else {
        sendErrorResponse(res, 400, "Failed to create product", err.message);
      }
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const product_id = parseInt(req.params.product_id);
      const product: UpdateProduct = req.body;
      const updatedProduct = await this.productService.updateProduct(
        product_id,
        product
      );
      res.status(201).send({
        message: `Successfully updated product with ID ${product_id}`,
        status: res.statusCode,
        data: updatedProduct,
      });
    } catch (error) {
      const err = error as Error;
      if (error instanceof ZodError) {
        sendZodErrorResponse(res, error);
      } else {
        sendErrorResponse(res, 400, "Failed to update product", err.message);
      }
    }
  }

  async updateProductImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        throw new Error("no file uploaded");
      }
      const image: string = (req as any).file?.path || "";
      const image_id = parseInt(req.params.image_id);
      await this.productService.updateProductImage(image_id, image);
      res.status(201).send({
        message: `Successfully updated product image`,
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, "Failed to update product", err.message);
    }
  }

  async getProductsForUserByStoreId(req: Request, res: Response) {
    try {
      const store_Id = parseInt(req.params.store_id);
      if (isNaN(store_Id)) {
        return sendErrorResponse(res, 400, `Invalid store ID provided`);
      }
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const sortField = (req.query.sortField as string) || "product_name";
      const sortOrder = (req.query.sortOrder as string) || "asc";
      const search = (req.query.search as string) || "";
      const category = (req.query.category as string) || "";

      const inventories = await this.getProductService.getAllProductUser(
        store_Id,
        page,
        pageSize,
        search,
        category,
        (sortField as "price") || "product_name",
        sortOrder as "asc" | "desc"
      );
      res.status(201).send({
        message: "Get inventories successfull",
        status: res.statusCode,
        inventories,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(
        res,
        400,
        `Failed to get Inventories for the store ID`,
        err.message
      );
    }
  }

  async getProductsForSuperAdmin(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const sortField = (req.query.sortField as string) || "product_name";
      const sortOrder = (req.query.sortOrder as string) || "asc";
      const search = (req.query.search as string) || "";
      const category = (req.query.category as string) || "";
      const products = await this.getProductService.getAllProductsAdmin(
        page,
        pageSize,
        search,
        category,
        (sortField as "product_name") || "price",
        sortOrder as "asc" | "desc"
      );
      res.status(201).send({
        message: "Get Products successfull",
        status: res.statusCode,
        products,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(
        res,
        400,
        `Failed to get products for the product ID`,
        err.message
      );
    }
  }

  async getProductDetailforUser(req: Request, res: Response) {
    try {
      const inventory_id = parseInt(req.params.inventory_id);
      const inventory =
        await this.getProductService.getProductDetailUser(inventory_id);
      res.status(201).send({
        message: "Get inventory successfull",
        status: res.statusCode,
        inventory,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(
        res,
        400,
        "Failed to get inventory details",
        err.message
      );
    }
  }

  async getProductDetailforSuperAdmin(req: Request, res: Response) {
    try {
      const product_id = parseInt(req.params.product_id);
      const product =
        await this.getProductService.getProductDetailAdmin(product_id);
      res.status(201).send({
        message: "Get product successfull",
        status: res.statusCode,
        product,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, "Failed to get product details", err.message);
    }
  }
}
