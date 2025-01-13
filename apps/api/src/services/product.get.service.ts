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
        is_deleted: false, // Ensure only non-deleted products are fetched
        ...(search && {
          product_name: {
            contains: search,
            mode: "insensitive",
          },
        }),
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
      where: search || category ? whereCondition : { store_id, Product: { is_deleted: false } },
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
            Category: { select: { category_name: true, category_id: true } },
            ProductImages: {
              select: { product_image: true },
              where: { is_primary: true },
            },
          },
        },
        Discounts: {
          where: {
            is_deleted: false,
            is_active: true,
            start_date: { lte: new Date() },
            end_date: { gte: new Date() },
          },
          select: {
            type: true,
            value: true,

          }
        }
      },
    });
    const totalItems = await this.prisma.inventories.count({
      where: { store_id, Product: {is_deleted: false} },
    });
    return {
      data: inventories.map((inventory) => ({
        inventory_id: inventory.inventory_id,
        product_id: inventory.Product.product_id,
        product_image:
          inventory.Product.ProductImages[0]?.product_image || null,
        product_name: inventory.Product.product_name,
        category_id: inventory.Product.Category.category_id,
        category_name: inventory.Product.Category.category_name,
        user_stock: inventory.user_stock,
        price: inventory.Product.price,
        discounted_price: inventory.discounted_price,
        discount_type: inventory.Discounts?.[0]?.type || null,
        discount_value: Number(inventory.Discounts?.[0]?.value) || null, 
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
    category: string | "",
    sortField: "price" | "product_name" = "product_name",
    sortOrder: "asc" | "desc" = "asc"
  ) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const whereCondition: any = {
      is_deleted: false, // Exclude deleted products
      ...(search && {
        product_name: {
          contains: search,
          mode: "insensitive",
        },
      }),
      ...(category && {
        Category: {
          category_name: {
            contains: category,
            mode: "insensitive",
          },
        },
      }),
    };

    const products = await this.prisma.products.findMany({
      where: search || category ? whereCondition : {is_deleted: false},
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
    const totalItems = await this.prisma.products.count({
      where: {is_deleted: false},
    });
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
            image_id: true,
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
      description: product.description,
      category_name: product.Category.category_name,
      price: product.price,
      availability: product.availability,
      is_deleted: product.is_deleted,
      created_at: product.created_at,
      updated_at: product.updated_at,
      product_images: product.ProductImages.map((image) => ({
        image_id: image.image_id,
        product_image: image.product_image,
        is_primary: image.is_primary,
      })),
    };
  }

  async getAllProductNameId(){
    const products = await this.prisma.products.findMany({
      select: {
        product_id: true,
        product_name: true,
      }
    })
    return products;
  }

  async getAllStoreNameId(){
    const stores = await this.prisma.stores.findMany({
      select: {
        store_id: true,
        store_name: true,
      }
    })
    return stores;
  }
}
