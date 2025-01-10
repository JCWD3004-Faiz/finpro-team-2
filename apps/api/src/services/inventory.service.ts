import { PrismaClient } from "@prisma/client";
import {
  inventorySchema,
  stockSchema,
} from "../validators/inventory.validator";
import { ChangeCategory, ChangeType } from "../models/inventory.models";

export class InventoryService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async checkExistingInventory(inventory_id: number) {
    const data = await this.prisma.inventories.findUnique({
      where: { inventory_id },
    });
    if (!data) {
      throw new Error("Inventory not found");
    }
    return data;
  }

  private async checkOrderCartItems(orderId: number) {
    const order = await this.prisma.orders.findUnique({
      where: { order_id: orderId },
      include: {
        Cart: {
          include: {
            CartItems: true,
          },
        },
      },
    });
    if (!order) {
      throw new Error("Order not found");
    }
    return order;
  }

  async superAdminCreateStockJournal(
    store_id: number,
    inventories: {
      inventoryId: number;
      stockChange: number;
      changeCategory: string;
    }[]
  ) {
    try {
      const store = await this.prisma.stores.findUnique({
        where: { store_id },
      });

      if (!store) {
        throw new Error(`Store with ID ${store_id} not found.`);
      }

      const stockJournalPromises = inventories.map(async (inventory) => {
        const { inventoryId, stockChange, changeCategory } = inventory;

        const inventoryRecord = await this.prisma.inventories.findUnique({
          where: { inventory_id: inventoryId },
        });

        if (!inventoryRecord) {
          throw new Error(`Inventory with ID ${inventoryId} not found.`);
        }

        const newStock = inventoryRecord.stock + stockChange;

        if (newStock < 0) {
          throw new Error(
            `Insufficient stock for inventory ID ${inventoryId}. Cannot have negative stock.`
          );
        }

        const updatedData: any = {
          stock: newStock,
          user_stock: newStock - 10,
        };

        if (changeCategory === "SOLD") {
          updatedData.items_sold =
            (inventoryRecord.items_sold || 0) + stockChange;
        }

        await this.prisma.inventories.update({
          where: { inventory_id: inventoryId },
          data: updatedData,
        });

        let changeType: ChangeType;
        if (inventoryRecord.stock > newStock) {
          changeType = ChangeType.DECREASE;
        } else if (inventoryRecord.stock < newStock) {
          changeType = ChangeType.INCREASE;
        } else {
          throw new Error(
            `There is no stock change for inventory ID ${inventoryId}.`
          );
        }

        const categoryEnum =
          ChangeCategory[changeCategory as keyof typeof ChangeCategory];
        if (!categoryEnum) {
          throw new Error(`Invalid change category: ${changeCategory}`);
        }

        return this.prisma.stockJournal.create({
          data: {
            inventory_id: inventoryId,
            change_type: changeType,
            change_quantity: stockChange,
            prev_stock: inventoryRecord.stock,
            new_stock: newStock,
            change_category: categoryEnum,
          },
        });
      });
      const stockJournals = await Promise.all(stockJournalPromises);
      return stockJournals;
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message);
    }
  }

  async storeAdminUpdateStock(inventory_id: number, stock: number) {
    const data = { stock };
    const validatedData = inventorySchema.parse(data);
    return this.prisma.inventories.update({
      where: { inventory_id },
      data: {
        stock: validatedData.stock,
      },
    });
  }

  async createStockJournalForPayment(order_id: number) {
    const order = await this.checkOrderCartItems(order_id);
    const cartItems = order.Cart.CartItems;
    for (const item of cartItems) {
      const inventory = await this.prisma.inventories.findUnique({
        where: { inventory_id: item.inventory_id },
      });

      if (!inventory) {
        throw new Error(`Inventory not found for item ID ${item.inventory_id}`);
      }

      const newStock = inventory.stock - item.quantity;

      if (newStock < 2) {
        throw new Error(
          `Insufficient stock for inventory ID ${item.inventory_id}`
        );
      }

      await this.prisma.inventories.update({
        where: { inventory_id: item.inventory_id },
        data: {
          stock: newStock,
        },
      });

      await this.prisma.stockJournal.create({
        data: {
          inventory_id: item.inventory_id,
          change_type: "DECREASE",
          change_quantity: item.quantity,
          prev_stock: inventory.stock,
          new_stock: newStock,
          change_category: "SOLD",
        },
      });
    }
  }

  async getInventoryForDiscountByStoreId(store_id: number) {
    const store = await this.prisma.stores.findUnique({
      where: { store_id },
    });
    if (!store) {
      throw new Error("Store not found");
    }

    const discountedInventoryIds = (
      await this.prisma.discounts.findMany({
        select: { inventory_id: true },
      })
    )
      .map((discount) => discount.inventory_id)
      .filter((id): id is number => id !== null);
    const inventories = await this.prisma.inventories.findMany({
      where: {
        store_id,
        // Ensure inventory_id is not in the discounts table
        NOT: {
          inventory_id: {
            in: discountedInventoryIds,
          },
        },
      },
      select: {
        inventory_id: true,
        product_id: true,
        Product: {
          select: {
            product_name: true,
          },
        },
      },
    });

    const sortedInventories = inventories
      .map((inventory) => ({
        inventory_id: inventory.inventory_id,
        product_id: inventory.product_id,
        product_name: inventory.Product?.product_name || "N/A",
      }))
      .sort((a, b) => a.product_name.localeCompare(b.product_name));

    return sortedInventories;
  }

  async getInventoryWithProductNameByStoreId(store_id: number) {
    const store = await this.prisma.stores.findUnique({
      where: { store_id },
    });
    if (!store) {
      throw new Error("Store not found");
    }
    const inventories = await this.prisma.inventories.findMany({
      where: { store_id },
      select: {
        inventory_id: true,
        product_id: true,
        Product: {
          select: {
            product_name: true,
          },
        },
      },
    });

    const sortedInventories = inventories
      .map((inventory) => ({
        inventory_id: inventory.inventory_id,
        product_id: inventory.product_id,
        product_name: inventory.Product?.product_name || "N/A",
      }))
      .sort((a, b) => a.product_name.localeCompare(b.product_name));

    return sortedInventories;
  }

  async getInventoriesByStoreId(
    store_id: number,
    page: number = 1,
    pageSize: number = 10,
    sortField: "stock" | "product_name" | "items_sold" = "stock",
    sortOrder: "asc" | "desc" = "asc",
    search: string = ""
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
      },
    };
    const inventories = await this.prisma.inventories.findMany({
      where: search ? whereCondition : { store_id },
      skip,
      take,
      orderBy:
        sortField === "product_name"
          ? {
              Product: {
                product_name: sortOrder,
              },
            }
          : {
              [sortField]: sortOrder,
            },
      include: {
        Product: {
          select: {
            product_name: true,
            Category: {
              select: {
                category_name: true,
              },
            },
          },
        },
      },
    });
    const totalItems = await this.prisma.inventories.count({
      where: { store_id },
    });
    return {
      data: inventories,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    };
  }
}
