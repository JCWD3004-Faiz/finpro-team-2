import { PrismaClient, Discounts } from "@prisma/client";
import { CreateDiscount } from "../models/discount.models";
import { discountSchema } from "../validators/discount.validator";
import cloudinary from "../config/cloudinary";
import config from "../config/config";

const CLOUDINARY_NAME = config.CLOUDINARY_NAME as string;

export class DiscountService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async updateInventoriesDiscountedPrice(
    store_id: number,
    inventory_id?: number | null
  ) {
    console.log("store_id: ", store_id);
    console.log("inventory_id: ", inventory_id);

    // Fetch inventories
    const inventories = await this.prisma.inventories.findMany({
      where: {
        store_id,
        ...(inventory_id !== null &&
          inventory_id !== undefined && {
            inventory_id,
          }),
      },
      include: {
        Product: {
          select: { price: true },
        },
      },
    });

    for (const inventory of inventories) {
      const { Product } = inventory;
      let discountedPrice = Product.price.toNumber();
      let discounts: Discounts[] = [];

      // Fetch discounts for the specific inventory_id
      const inventorySpecificDiscounts = await this.prisma.discounts.findMany({
        where: {
          store_id,
          inventory_id: inventory.inventory_id, // Match specific inventory
          is_active: true,
          start_date: { lte: new Date() },
          end_date: { gte: new Date() },
        },
        orderBy: { value: "desc" }, // Prioritize higher-value discounts
      });

      // Fetch store-wide discounts
      const storeWideDiscounts = await this.prisma.discounts.findMany({
        where: {
          store_id,
          inventory_id: null, // Match store-wide discounts
          is_active: true,
          start_date: { lte: new Date() },
          end_date: { gte: new Date() },
        },
        orderBy: { value: "desc" }, // Prioritize higher-value discounts
      });

      // Combine both inventory-specific and store-wide discounts
      discounts = [...inventorySpecificDiscounts, ...storeWideDiscounts];

      // Apply discounts
      if (discounts.length > 0) {
        for (const discount of discounts) {
          if (discount.type === "PERCENTAGE") {
            console.log("Applying percentage discount: ", discount.value, "%");
            if (!discount.value) {
              throw new Error("Percentage discount must have a value.");
            }
            const percentage = discount.value.toNumber() / 100;
            discountedPrice *= 1 - percentage; // Apply percentage discount
          } else if (discount.type === "NOMINAL") {
            console.log("Applying nominal discount: ", discount.value);
            if (!discount.value) {
              throw new Error("Nominal discount must have a value.");
            }
            discountedPrice = Math.max(
              discountedPrice - discount.value.toNumber(),
              0 // Ensure the price doesn't go below 0
            );
          }
          // Add BOGO logic if needed
        }
      }

      // Round to 2 decimal places
      discountedPrice = parseFloat(discountedPrice.toFixed(2));
      console.log(
        `Inventory ID: ${inventory.inventory_id}, Product ID: ${inventory.product_id}, updated discounted price: ${discountedPrice}`
      );

      // Update the inventory with the new discounted price
      // await this.prisma.inventories.update({
      //   where: { inventory_id: inventory.inventory_id },
      //   data: { discounted_price: discountedPrice },
      // });
    }
  }

  async createDiscount(discount: CreateDiscount) {
    const validatedData = discountSchema.parse(discount);
    const placeholderImage = `https://res.cloudinary.com/${CLOUDINARY_NAME}/image/upload/v1734509885/placeholderpic_eh2ow7.png`;
    const startDate = new Date(validatedData.start_date);
    const endDate = new Date(validatedData.end_date);
    if (startDate >= endDate) {
      throw new Error("Start date must be earlier than end date");
    }
    if (validatedData.type === "BOGO" && !validatedData.bogo_product_id) {
      throw new Error("BOGO discounts require a bogo_product_id.");
    }

    if (
      validatedData.type === "PERCENTAGE" &&
      (validatedData.value === undefined || validatedData.value > 100)
    ) {
      throw new Error(
        "Percentage discounts require a valid value between 0 and 100."
      );
    }

    if (validatedData.type === "NOMINAL" && validatedData.value === undefined) {
      throw new Error("Nominal discounts require a valid value.");
    }

    let uploadedImageUrl: string | null = null;

    if (discount.image) {
      const uploadResponse = await cloudinary.uploader.upload(discount.image, {
        folder: "discountImages",
      });
      uploadedImageUrl = uploadResponse.secure_url;
    }
    const newDiscount = await this.prisma.discounts.create({
      data: {
        ...validatedData,
        image: uploadedImageUrl,
      },
    });
    await this.updateInventoriesDiscountedPrice(
      newDiscount.store_id,
      newDiscount.inventory_id
    );
    return newDiscount;
  }
}
