import bcrypt from "bcryptjs";
import { User } from "../models/admin.models";
import { PrismaClient } from "@prisma/client";
import { adminRegisterSchema } from "../validators/admin.register.validator";


export class AdminAuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async register(data: User) {
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
}
