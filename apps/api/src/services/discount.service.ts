import { PrismaClient, Discounts } from "@prisma/client";
import { CreateDiscount, UpdateDiscount } from "../models/discount.models";
import {
  discountSchema,
  updateDiscountSchema,
} from "../validators/discount.validator";
import { updateInventoriesDiscountedPrice } from "../utils/discount.utils";
import cloudinary from "../config/cloudinary";
import config from "../config/config";

const CLOUDINARY_NAME = config.CLOUDINARY_NAME as string;

export class DiscountService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  private async checkDiscountId(discount_id: number) {
    const discountData = await this.prisma.discounts.findUnique({
      where: { discount_id },
    });
    if (!discountData) {
      throw new Error("Discount not found.");
    }
    return discountData;
  }

  private checkDiscountType(
    validatedData: Partial<CreateDiscount | UpdateDiscount>
  ) {
    if (validatedData.start_date && validatedData.end_date) {
      const startDate = new Date(validatedData.start_date as string);
      const endDate = new Date(validatedData.end_date as string);

      if (startDate >= endDate) {
        throw new Error("Start date must be earlier than end date");
      }
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
  }

  async createDiscount(discount: CreateDiscount) {
    const validatedData = discountSchema.parse(discount);
    this.checkDiscountType(validatedData);

    if (validatedData.inventory_id) {
      const inventory = await this.prisma.inventories.findFirst({
        where: {
          inventory_id: validatedData.inventory_id,
          store_id: validatedData.store_id,
        },
      });

      if (!inventory) {
        throw new Error(
          `Inventory ID ${validatedData.inventory_id} does not exist or does not belong to Store ID ${validatedData.store_id}.`
        );
      }
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
    await updateInventoriesDiscountedPrice(
      newDiscount.store_id,
      newDiscount.inventory_id
    );
    return newDiscount;
  }

  async updateDiscount(discount_id: number, discount: UpdateDiscount) {
    if ("type" in discount) {
      throw new Error("The discount type cannot be updated.");
    }
    const validatedData = updateDiscountSchema.parse(discount);
    const discountData = await this.checkDiscountId(discount_id);

    if ("bogo_product_id" in discount) {
      if (discountData.type === "PERCENTAGE") {
        throw new Error(
          "Cannot update bogo_product_id for a PERCENTAGE type discount."
        );
      }
      if (discountData.type === "NOMINAL") {
        throw new Error(
          "Cannot update bogo_product_id for a NOMINAL type discount."
        );
      }
    }

    if ("value" in discount) {
      if (
        discountData.type === "PERCENTAGE" &&
        (validatedData.value === undefined || validatedData.value > 100)
      ) {
        throw new Error(
          "Percentage discounts require a valid value between 0 and 100."
        );
      }
      if (
        discountData.type === "NOMINAL" &&
        validatedData.value === undefined
      ) {
        throw new Error("Nominal discounts require a valid value.");
      }
      if (discountData.type === "BOGO") {
        throw new Error("Can't change value if discount type is BOGO");
      }
    }

    if (validatedData.start_date || validatedData.end_date) {
      const startDate = new Date(validatedData.start_date as string);
      const endDate = new Date(validatedData.end_date as string);
      if (
        startDate >= discountData.end_date ||
        discountData.start_date >= endDate
      ) {
        throw new Error("Start date must be earlier than end date");
      }
    }

    const updatedDiscount = await this.prisma.discounts.update({
      where: { discount_id },
      data: validatedData,
    });
    await updateInventoriesDiscountedPrice(
      updatedDiscount.store_id,
      updatedDiscount.inventory_id
    );
    return updatedDiscount;
  }

  async deleteDiscount(discount_id: number) {
    await this.checkDiscountId(discount_id);
    const deleteDiscount = await this.prisma.discounts.update({
      where: { discount_id },
      data: {
        is_deleted: true,
      },
    });
    await updateInventoriesDiscountedPrice(
      deleteDiscount.store_id,
      deleteDiscount.inventory_id
    );
    return deleteDiscount;
  }

  async updateDiscountImage( discount_id: number, image: string ) {
    await this.checkDiscountId(discount_id);
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "discounts",
    });
    return this.prisma.discounts.update({
      where: { discount_id: discount_id },
      data: {
        image: uploadResponse.secure_url,
      },
    });
  }
}
