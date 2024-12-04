import { PrismaClient } from "@prisma/client";

export class SuperAdminService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllStoreAdmins() {
    try {
      const storeAdmins = await this.prisma.users.findMany({
        where: { role: 'STORE_ADMIN' },
        include: { Store: { select: { store_name: true } } },
      });
      return storeAdmins.map(admin => ({
        user_id: admin.user_id, username: admin.username, email: admin.email,
        store_name: admin.Store ? admin.Store.store_name : "Unassigned",
      }));
    } catch (error) {
      console.error("Error fetching store admins: ", error);
      throw new Error("Unable to fetch store admins.");
    }
  }
}
