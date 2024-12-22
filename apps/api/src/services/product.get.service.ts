import { PrismaClient } from "@prisma/client";

export class GetProductService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async getAllProductUser(
    store_id: number,
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    category: string | null = null,
    sortField: "price" | "product_name" = "product_name",
    sortOrder: "asc" | "desc" = "asc"
  ) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const whereCondition: any = {
      store_id,
      Product: {
        product_name: {
          contains: search,
          mode: "insensitive",
        },
        ...(category && {
          Category: {
            category_name: {
              equals: category,
              mode: "insensitive",
            },
          },
        }),
      },
    };

    const inventories = await this.prisma.inventories.findMany({
      where: search || category ? whereCondition : { store_id },
      skip,
      take,
      orderBy:
        sortField === "product_name"
          ? { Product: { product_name: sortOrder } }
          : { Product: { price: sortOrder } },
      include: {
        Product: {
          select: {
            product_id: true,
            product_name: true,
            price: true,
            Category: { select: { category_name: true } },
            ProductImages: {
              select: { product_image: true },
              where: { is_primary: true },
            },
          },
        },
      },
    });
    const totalItems = await this.prisma.inventories.count({
      where: { store_id },
    });
    return {
      data: inventories.map((inventory) => ({
        inventory_id: inventory.inventory_id,
        product_id: inventory.Product.product_id,
        product_image:
          inventory.Product.ProductImages[0]?.product_image || null,
        product_name: inventory.Product.product_name,
        user_stock: inventory.user_stock,
        price: inventory.Product.price,
        discounted_price: inventory.discounted_price,
      })),
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    };
  }

  async getAllProductsAdmin(
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    category: string | null = null,
    sortField: "price" | "product_name" = "product_name",
    sortOrder: "asc" | "desc" = "asc"
  ) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const whereCondition: any = {
      product_name: {
        contains: search,
        mode: "insensitive",
      },
      ...(category && {
        Category: {
          category_name: {
            equals: category,
            mode: "insensitive",
          },
        },
      }),
    };

    const products = await this.prisma.products.findMany({
      where: search || category ? whereCondition : undefined,
      skip,
      take,
      orderBy:
        sortField === "product_name"
          ? { product_name: sortOrder }
          : { price: sortOrder },
      include: {
        Category: {
          select: { category_name: true },
        },
      },
    });
    const totalItems = await this.prisma.products.count({});
    return {
      data: products.map((product) => ({
        product_id: product.product_id,
        product_name: product.product_name,
        category: product.Category?.category_name || null,
        price: product.price,
        availability: product.availability,
        created_at: product.created_at,
        updated_at: product.updated_at,
      })),
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    };
  }

  async getProductDetailUser(inventory_id: number) {
    const inventory = await this.prisma.inventories.findUnique({
      where: { inventory_id },
      include: {
        Product: {
          select: {
            product_id: true,
            product_name: true,
            description: true,
            price: true,
            Category: { select: { category_name: true } },
            ProductImages: {
              select: {
                product_image: true,
                is_primary: true,
              },
            },
          },
        },
      },
    });
    if (!inventory) {
      throw new Error("No Inventory data for this ID");
    }
    return {
      inventory_id: inventory.inventory_id,
      product_id: inventory.Product.product_id,
      product_name: inventory?.Product.product_name,
      description: inventory?.Product.description,
      category_name: inventory?.Product.Category.category_name,
      discounted_price: inventory.discounted_price,
      price: inventory?.Product.price,
      user_stock: inventory?.user_stock,
      product_images: inventory?.Product.ProductImages.map((image) => ({
        product_image: image.product_image,
        is_primary: image.is_primary,
      })),
    };
  }

  async getProductDetailAdmin(product_id: number) {
    const product = await this.prisma.products.findUnique({
      where: { product_id },
      include: {
        ProductImages: {
          select: {
            product_image: true,
            is_primary: true,
          },
        },
        Category: { select: { category_name: true } },
      },
    });
    if (!product) {
      throw new Error("No Product data for this ID");
    }
    return {
      product_id: product.product_id,
      product_name: product.product_name,
      category_name: product.Category.category_name,
      price: product.price,
      availability: product.availability,
      is_deleted: product.is_deleted,
      created_at: product.created_at,
      updated_at: product.updated_at,
      product_images: product.ProductImages.map((image) => ({
        product_image: image.product_image,
        is_primary: image.is_primary,
      })),
    };
  }
}