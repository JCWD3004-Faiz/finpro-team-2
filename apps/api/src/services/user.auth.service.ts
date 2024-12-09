import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { user } from "../models/user.models";
import {
  userRegisterSchema,
  authScehma,
  userPendingSchema,
} from "../validators/user.auth.validator";
import {
  generateReferralCode,
  validatePassword,
  generateTokens,
  generateAccessToken,
} from "../utils/user.auth.utils";
import { initializeCron } from "./cron.service";

const JWT_SECRET = process.env.JWT_SECRET as string;
export class UserAuthService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  private async validateRegisterCode(
    registerCode: string | undefined
  ): Promise<void> {
    if (registerCode) {
      const exists = await this.prisma.users.findUnique({
        where: { referral_code: registerCode },
      });
      if (!exists) {
        throw new Error(
          "Invalid register code: No matching referral code found"
        );
      }
    }
  }

  async updatePendingRegistrationStatus(email: string) {
    return this.prisma.pendingRegistrations.update({
      where: { email },
      data: {
        verification_token: null,
        is_blocked: false, // Unblock the user
        attempts: 0,
      },
    });
  }

  async resetPassword(email: string, password: string) {
    const data = { email, password };
    const validatedData = authScehma.parse(data);
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.prisma.users.update({
      where: { email: validatedData.email },
      data: { password_hash: hashedPassword },
    });

    return this.updatePendingRegistrationStatus(validatedData.email)
  }

  async userRegister(data: user) {
    const validatedData = userRegisterSchema.parse(data);
    const hashedPassword = await bcrypt.hash(data.password_hash, 10);
    const referral_code = generateReferralCode();
    await this.validateRegisterCode(data.register_code);
    await this.prisma.users.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password_hash: hashedPassword,
        role: "USER",
        referral_code: referral_code,
        register_code: data.register_code,
        is_verified: true,
        updated_at: new Date(),
      },
    });

    return this.updatePendingRegistrationStatus(validatedData.email);
  }

  async verifyEmail(data: { username: string; email: string }) {
    const validatedData = userPendingSchema.parse(data);
    await this.prisma.users.update({
      where: { email: validatedData.email },
      data: { is_verified: true },
    });

    return this.updatePendingRegistrationStatus(validatedData.email);
  }

  async login(email: string, password: string) {
    const data = { email, password };
    const validatedData = authScehma.parse(data);
    const user = await this.prisma.users.findUnique({
      where: { email: validatedData.email },
    });
    if (!user || !(await validatePassword(password, user.password_hash))) {
      throw new Error("Invalid Credentials");
    }
    const { accessToken, refreshToken } = generateTokens(user);
    await this.prisma.users.update({
      where: { email: email },
      data: { refresh_token: refreshToken },
    });
    return { accessToken, refreshToken, user };
  }

  async refereshToken(token: string) {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await this.prisma.users.findUnique({
        where: { user_id: decoded.id },
      });
      if (!user) {
        throw new Error("Invalid Refersh Token");
      }
      const accessToken = generateAccessToken(user);
      return { accessToken };
    } catch (error) {
      throw new Error("Invalid Refersh Token");
    }
  }
  
}

cron.schedule("*/1 * * * *", async () => {
  console.log("Testing Cronnnasdflsakdjf");
})
initializeCron();

