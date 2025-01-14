import { PrismaClient } from "@prisma/client";

export class GetDiscountService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getDiscountByStoreId(store_id: number) {
    try {
      const discounts = await this.prisma.discounts.findMany({
        where: {
          store_id,
          is_deleted: false,
          is_active: true,
          start_date: { lte: new Date() },
          end_date: { gte: new Date() },
        },
        include: {
          Inventory: {
            include: {
              Product: {
                select: {
                  product_name: true,
                },
              },
            },
          },
          BogoProduct: {
            select: {
              product_name: true,
            },
          },
        },
        orderBy: {
          start_date: "desc",
        }
      });

      return discounts.map((discount) => ({
        discount_id: discount.discount_id,
        inventory_id: discount.inventory_id,
        bogo_product_id: discount.bogo_product_id,
        type: discount.type,
        value: discount.value,
        min_purchase: discount.min_purchase,
        max_discount: discount.max_discount,
        description: discount.description,
        is_active: discount.is_active,
        image: discount.image,
        start_date: discount.start_date,
        end_date: discount.end_date,
        product_name: discount.Inventory?.Product?.product_name || null,
        bogo_product_name: discount.BogoProduct?.product_name || null,
      }));
    } catch (error) {
      const err = error as Error;
      throw new Error(
        `Failed to fetch discounts for store ID ${store_id}: ${err.message}`
      );
    }
  }

  async getAllDiscountsAdmin(
    storeId: number,
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    sortField: "start_date" | "type" | "end_date" = "start_date",
    sortOrder: "asc" | "desc" = "asc"
  ) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const whereCondition: any = {
      store_id: storeId,
      is_deleted: false, // Optional: exclude deleted records
      ...(search && {
        description: {
          contains: search,
          mode: "insensitive",
        },
      }),
    };

    const discounts = await this.prisma.discounts.findMany({
      where: whereCondition,
      skip,
      take,
      orderBy:
        sortField === "start_date"
          ? { start_date: sortOrder }
          : sortField === "type"
            ? { type: sortOrder }
            : { end_date: sortOrder },
      include: {
        Inventory: {
          select: {
            inventory_id: true,
            Product: { select: { product_name: true } },
          },
        },
        BogoProduct: {
          select: {
            product_name: true,
          },
        },
      },
    });

    const totalItems = await this.prisma.discounts.count({
      where: { store_id: storeId },
    });

    return {
      data: discounts.map((discount) => ({
        discount_id: discount.discount_id,
        inventory_id: discount.inventory_id,
        store_id: discount.store_id,
        product_name: discount.Inventory?.Product?.product_name || "N/A",
        type: discount.type,
        value: discount.value,
        min_purchase: discount.min_purchase,
        max_discount: discount.max_discount,
        bogo_product_name: discount.BogoProduct?.product_name || "N/A",
        description: discount.description,
        is_active: discount.is_active,
        is_deleted: discount.is_deleted,
        start_date: discount.start_date,
        end_date: discount.end_date,
        created_at: discount.created_at,
        updated_at: discount.updated_at,
      })),
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    };
  }

  async getDiscountDetail(discount_id: number) {
    const discount = await this.prisma.discounts.findUnique({
      where: { discount_id },
      include: {
        BogoProduct: {
          select: {
            product_name: true,
          },
        },
        Inventory: {
          select: {
            Product: {
              select: {
                product_name: true,
              },
            },
          },
        },
      },
    });
    if (!discount) {
      throw new Error("Discount not found");
    }

    return {
      discount_id: discount.discount_id,
      inventory_id: discount.inventory_id,
      inventory_name: discount.Inventory?.Product.product_name,
      type: discount.type,
      value: discount.value,
      min_purchase: discount.min_purchase,
      max_discount: discount.max_discount,
      bogo_product_id: discount.bogo_product_id,
      bogo_product_name: discount.BogoProduct?.product_name || null,
      description: discount.description,
      is_active: discount.is_active,
      image: discount.image,
      start_date: discount.start_date,
      end_date: discount.end_date,
      created_at: discount.created_at,
      updated_at: discount.updated_at,
      is_deleted: discount.is_deleted,
    };
  }
}
