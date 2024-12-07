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
}
