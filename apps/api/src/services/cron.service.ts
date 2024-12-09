import cron from "node-cron";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function initializeCron() {
  await prisma.$connect();

  cron.schedule("*/1 * * * *", async () => {

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
}

initializeCron();
