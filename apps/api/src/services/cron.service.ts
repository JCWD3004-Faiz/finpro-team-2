import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { updateInventoriesDiscountedPrice } from "../utils/discount.utils";

const prisma = new PrismaClient();

export async function initializeCron() {
  await prisma.$connect();

  cron.schedule("*/10 * * * *", async () => {
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
    } catch (error) {
      const err = error as Error;
      console.error("Error occurred during cron job:", err.message);
    }
  });

  cron.schedule("0 0 * * *", async () => {
    try {
      // Fetch all active stores (not deleted)
      const stores = await prisma.stores.findMany({
        where: { is_deleted: false },
        select: { store_id: true },
      });

      // Iterate over each store and run the updateInventoriesDiscountedPrice function
      for (const store of stores) {
        await updateInventoriesDiscountedPrice(store.store_id);
      }
    } catch (error) {
      const err = error as Error;
      console.error("Error occurred during cron job:", err.message);
    }
  });

  cron.schedule("0 0 */12 * *", async () => {  
    try {
      // Get the current date
      const currentDate = new Date();
  
      // Find all user vouchers where the expiration_date has passed and voucher_status is not already EXPIRED
      const expiredVouchers = await prisma.userVouchers.findMany({
        where: {
          expiration_date: {
            lt: currentDate, // vouchers where expiration_date is less than the current date
          },
          voucher_status: {
            not: "EXPIRED", // exclude vouchers already marked as EXPIRED
          },
        },
      });
  
      if (expiredVouchers.length === 0) {
        return;
      }
  
      // Update the status of expired vouchers to EXPIRED
      for (const voucher of expiredVouchers) {
        await prisma.userVouchers.update({
          where: {
            user_voucher_id: voucher.user_voucher_id,
          },
          data: {
            voucher_status: "EXPIRED", // Set voucher status to EXPIRED
          },
        });
      }  
    } catch (error) {
      const err = error as Error;
      console.error("Error occurred during cron job:", err.message);
    }
  });
}

initializeCron();
