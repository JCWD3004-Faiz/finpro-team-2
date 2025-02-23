import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { successResponse, errorResponse } from '../utils/response.utils';
import { AuthRequest } from '../middleware/auth.middleware';

export class ProductController {
  constructor(private productService: ProductService) {}

  async getProducts(req: Request, res: Response) {
    try {
      const { search, category } = req.query;
      const products = await this.productService.getProducts({
        search: search as string,
        category: category as string
      });
      return res.json(successResponse(products));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async getProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await this.productService.getProduct(Number(id));
      return res.json(successResponse(product));
    } catch (error: any) {
      return res.status(404).json(errorResponse(error.message));
    }
  }

  async createProduct(req: AuthRequest, res: Response) {
    try {
      const product = await this.productService.createProduct(req.body);
      return res.status(201).json(successResponse(product));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async updateProduct(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const product = await this.productService.updateProduct(Number(id), req.body);
      return res.json(successResponse(product));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async deleteProduct(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(Number(id));
      return res.json(successResponse({ message: 'Product deleted successfully' }));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async updateStock(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const product = await this.productService.updateStock(Number(id), quantity);
      return res.json(successResponse(product));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }
}