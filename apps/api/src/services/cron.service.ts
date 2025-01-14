import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { updateInventoriesDiscountedPrice } from "../utils/discount.utils";

const prisma = new PrismaClient();

export async function initializeCron() {
  await prisma.$connect();

  cron.schedule("*/5 * * * *", async () => {
    console.log("Running email blocker cron job...");
    try {
      const blockedUsers = await prisma.pendingRegistrations.findMany({
        where: {
          is_blocked: true,
        },
      });

      if (blockedUsers.length === 0) {
        return;
      }

      for (const user of blockedUsers) {
        const lastAttemptTime = user.last_attempt;
        const blockPeriod = 1 * 60 * 1000; // 1 minute block period
        const elapsedTime =
          new Date().getTime() - new Date(lastAttemptTime).getTime();

        if (elapsedTime >= blockPeriod) {
          await prisma.pendingRegistrations.update({
            where: { email: user.email },
            data: {
              is_blocked: false, // Unblock the user
              attempts: 0, // Reset attempts
            },
          });
        }
      }
      console.log("Finished running email blocker cron job.");
    } catch (error) {
      const err = error as Error;
      console.error("Error occurred during cron job:", err.message);
    }
  });

  cron.schedule("*/7 * * * *", async () => {
    console.log("Running inventory discount update cron job...");

    try {
      // Fetch all active stores (not deleted)
      const stores = await prisma.stores.findMany({
        where: { is_deleted: false },
        select: { store_id: true },
      });

      // Iterate over each store and run the updateInventoriesDiscountedPrice function
      for (const store of stores) {
        //console.log(`Updating discounts for store_id: ${store.store_id}`);
        await updateInventoriesDiscountedPrice(store.store_id);
      }

      console.log("Finished running inventory discount update cron job.");
    } catch (error) {
      const err = error as Error;
      console.error("Error occurred during cron job:", err.message);
    }
  });
}

initializeCron();
