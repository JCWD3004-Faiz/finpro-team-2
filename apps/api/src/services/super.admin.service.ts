import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { User } from "../models/admin.models";
import { adminRegisterSchema } from "../validators/admin.register.validator";



export class SuperAdminService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async registerAdmin(data: User) {
    const validatedData = adminRegisterSchema.parse(data);
    const hashedPassword = await bcrypt.hash(validatedData.password_hash, 10);
    return this.prisma.users.create({
      data: {
        username: data.username,
        email: validatedData.email,
        password_hash: hashedPassword,
        role: data.role,
      },
    });
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

  async assignStoreAdmin(store_id: number, user_id: number) {
    try {
      const user = await this.prisma.users.findUnique({ where: { user_id } });
      if (!user || user.role !== 'STORE_ADMIN') throw new Error("Only users with the 'STORE_ADMIN' role can be assigned to a store.");
      const [currentStore, existingAdminStore] = await Promise.all([
        this.prisma.stores.findUnique({ where: { store_id } }),
        this.prisma.stores.findUnique({ where: { user_id } }),
      ]);
      if (existingAdminStore && existingAdminStore.store_id !== store_id) {
        await this.prisma.stores.update({ where: { store_id: existingAdminStore.store_id }, data: { user_id: null } });
      }
      if (currentStore?.user_id) {
        await this.prisma.users.update({ where: { user_id: currentStore.user_id }, data: { is_verified: false } });
      }
      await Promise.all([
        this.prisma.stores.update({ where: { store_id }, data: { user_id } }),
        this.prisma.users.update({ where: { user_id }, data: { is_verified: true } })
      ]);
      return { store: currentStore, user };
    } catch (error) {
      console.error("Error assigning store admin:", error);
      throw new Error("Unable to assign store admin.");
    }
  }
  
}
