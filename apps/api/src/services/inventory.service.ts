import { PrismaClient } from "@prisma/client";
import { inventorySchema, stockSchema } from "../validators/inventory.validator";
import { ChangeType } from "../models/inventory.models";

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

  private async checkOrderCartItems(orderId: number){
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

  async superAdminUpdateStock(inventory_id: number, stockChange: number) {
    let changeType: ChangeType;
    const inventoryBefore = await this.checkExistingInventory(inventory_id);

    const newStock = inventoryBefore.stock + stockChange
    if(newStock < 0){
      throw new Error("invalid stock change, stock would be less than 0");
    }
    if (inventoryBefore.stock > newStock) {
      changeType = ChangeType.DECREASE;
    } else if(inventoryBefore.stock < newStock) {
      changeType = ChangeType.INCREASE;
    }else{
      throw new Error(`There is no stock change for this inventory ID`);
    }
    return this.prisma.stockJournal.create({
      data: {
        inventory_id: inventory_id,
        change_type: changeType,
        change_quantity: stockChange,
        prev_stock: inventoryBefore.stock,
        new_stock: newStock,
        change_category: "STOCK_CHANGE",
      },
    });    
  }

  async storeAdminUpdateStock(inventory_id: number, stock: number){
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
        throw new Error(`Insufficient stock for inventory ID ${item.inventory_id}`);
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
}
