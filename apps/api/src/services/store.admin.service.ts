import { PrismaClient } from "@prisma/client";


export class StoreAdminService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getStoreByUserId(user_id: number) {
    return await this.prisma.stores.findUnique({
      where: { user_id: user_id },
    });
  }

  async getAdminById(user_id: number) {
    return await this.prisma.users.findUnique({
        where: { user_id: user_id },
    });
  }

  async getStoreById(store_id: number) {
    return await this.prisma.stores.findUnique({
      where: { store_id: store_id },
    });
  }
}
