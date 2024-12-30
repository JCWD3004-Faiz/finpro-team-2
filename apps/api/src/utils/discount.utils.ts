import { PrismaClient, Discounts } from "@prisma/client";

const prisma = new PrismaClient();

export async function updateInventoriesDiscountedPrice(
  store_id: number,
  inventory_id?: number | null
) {
  console.log("store_id: ", store_id);
  console.log("inventory_id: ", inventory_id);

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

    // Fetch store-wide discounts
    const storeWideDiscounts = await prisma.discounts.findMany({
      where: {
        store_id,
        inventory_id: null, // Match store-wide discounts
        is_active: true,
        start_date: { lte: new Date() },
        end_date: { gte: new Date() },
        is_deleted: false,
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
    // await prisma.inventories.update({
    //   where: { inventory_id: inventory.inventory_id },
    //   data: { discounted_price: discountedPrice },
    // });
  }
}
