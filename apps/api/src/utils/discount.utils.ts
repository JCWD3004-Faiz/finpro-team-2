import { PrismaClient, Discounts } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateInventoriesDiscountedPrice(
  store_id: number,
  inventory_id?: number | null
) {
  // Fetch inventories
  const inventories = await prisma.inventories.findMany({
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
    const inventorySpecificDiscounts = await prisma.discounts.findMany({
      where: {
        store_id,
        inventory_id: inventory.inventory_id, // Match specific inventory
        is_active: true,
        start_date: { lte: new Date() },
        end_date: { gte: new Date() },
        is_deleted: false,
      },
      orderBy: { value: "desc" }, // Prioritize higher-value discounts
    });

    // Combine both inventory-specific and store-wide discounts
    //discounts = [...inventorySpecificDiscounts, ...storeWideDiscounts];
    discounts = [...inventorySpecificDiscounts];

    // Apply discounts
    if (discounts.length > 0) {
      for (const discount of discounts) {
        if (discount.type === "PERCENTAGE") {
          if (!discount.value) {
            throw new Error("Percentage discount must have a value.");
          }
          const percentage = discount.value.toNumber() / 100;
          discountedPrice *= 1 - percentage; // Apply percentage discount
        } else if (discount.type === "NOMINAL") {
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

    //Update the inventory with the new discounted price
    await prisma.inventories.update({
      where: { inventory_id: inventory.inventory_id },
      data: { discounted_price: discountedPrice },
    });
  }
}

export async function checkAndApplyBogo(
  inventory_id: number,
  product_price: number
) {
  const inventoryPrice = await prisma.inventories.findUnique({
    where: { inventory_id },
    include: {
      Product: {
        select: {
          price: true,
        },
      },
    },
  });

  const inventoryDiscount = await prisma.discounts.findFirst({
    where: { inventory_id },
  });

  if (inventoryPrice) {
    if (inventoryDiscount?.type === "BOGO") {
      const newPrice = product_price - Number(inventoryPrice.Product.price);
      return newPrice;
    }
  }
  return product_price;
}

export async function wholeStoreCartDiscount(
  cartPrice: number,
  store_id: number
) {
  const wholeDiscount = await prisma.discounts.findFirst({
    where: {
      store_id: store_id,
      is_active: true,
      start_date: { lte: new Date() },
      end_date: { gte: new Date() },
      is_deleted: false,
      inventory_id: null,
    },
    orderBy: { start_date: "desc" },
  });

  //check if there is any discount, if none, return original price
  if (!wholeDiscount) {
    return cartPrice;
  }

  const { value, type, min_purchase, max_discount } = wholeDiscount;

  // Check if the cart meets the minimum purchase requirement
  if (min_purchase && cartPrice < min_purchase.toNumber()) {
    return cartPrice;
  }

  let discountedCartPrice = cartPrice;

  if (type === "PERCENTAGE" && value) {
    const discountAmount = (cartPrice * value.toNumber()) / 100;
    const cappedDiscount =
      max_discount && discountAmount > max_discount.toNumber()
        ? max_discount.toNumber()
        : discountAmount;
    discountedCartPrice -= cappedDiscount;
  } else if (type === "NOMINAL" && value) {
    const cappedDiscount =
      max_discount && value.toNumber() > max_discount.toNumber()
        ? max_discount.toNumber()
        : value.toNumber();
    discountedCartPrice = Math.max(discountedCartPrice - cappedDiscount, 0);
  }

  return parseFloat(discountedCartPrice.toFixed(2));
}
