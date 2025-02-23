import { Prisma } from '@prisma/client';
import prisma from '../config/database';

interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export class ProductService {
  async getProducts(filters: ProductFilters = {}) {
    const { search, category, minPrice, maxPrice, inStock } = filters;
    
    const where: Prisma.ProductWhereInput = {
      isDeleted: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(category && {
        category: { equals: category, mode: 'insensitive' }
      }),
      ...(minPrice !== undefined && {
        price: { gte: new Prisma.Decimal(minPrice) }
      }),
      ...(maxPrice !== undefined && {
        price: { lte: new Prisma.Decimal(maxPrice) }
      }),
      ...(inStock !== undefined && {
        stock: inStock ? { gt: 0 } : { equals: 0 }
      })
    };

    return prisma.product.findMany({
      where,
      orderBy: { name: 'asc' }
    });
  }

  async getProduct(id: number) {
    const product = await prisma.product.findFirst({
      where: { id, isDeleted: false }
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async createProduct(data: {
    name: string;
    category: string;
    price: number;
    stock: number;
    imageUrl?: string;
  }) {
    return prisma.product.create({
      data: {
        ...data,
        price: new Decimal(data.price)
      }
    });
  }

  async updateProduct(id: number, data: {
    name?: string;
    category?: string;
    price?: number;
    imageUrl?: string;
  }) {
    const product = await this.getProduct(id);

    return prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(data.price && { price: new Decimal(data.price) })
      }
    });
  }

  async deleteProduct(id: number) {
    const product = await this.getProduct(id);

    return prisma.product.update({
      where: { id },
      data: { isDeleted: true }
    });
  }

  async updateStock(id: number, quantity: number) {
    const product = await this.getProduct(id);
    const newStock = product.stock + quantity;

    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    return prisma.product.update({
      where: { id },
      data: { stock: newStock }
    });
  }
}