import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { user } from "../models/user.models";
import {
  userRegisterSchema,
  authScehma,
  userPendingSchema
} from "../validators/user.auth.validator";
import {
  generateReferralCode,
  validatePassword,
  generateVerifiationToken,
  generateTokens,
  generateAccessToken
} from "../utils/user.auth.utils";

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

  async userPendingRegister(data: {username: string, email: string}){
    const validatedData = userPendingSchema.parse(data);
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
    const verificationToken = generateVerifiationToken(data);
    return this.prisma.pendingRegistrations.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        verification_token: verificationToken,
        expires_at: expiresAt,
      }
    })
  }

  async userRegister(data: user) {
    const validatedData = userRegisterSchema.parse(data);
    const hashedPassword = await bcrypt.hash(data.password_hash, 10);
    const referral_code = generateReferralCode();
    await this.validateRegisterCode(data.register_code);
    return this.prisma.users.create({
      data: {
        username: validatedData.username,
        email: validatedData.email,
        password_hash: hashedPassword,
        role: "USER",
        referral_code: referral_code,
        register_code: data.register_code,
        is_verified: true,
        updated_at: new Date()
      },
    });
  }

  async login(email: string, password: string) {
    const data = { email, password };
    const validatedData = authScehma.parse(data);
    const user = await this.prisma.users.findUnique({
      where: {email: validatedData.email},
    });
    if (!user || !await(validatePassword(password, user.password_hash))) {
      throw new Error("Invalid Credentials");
    }
    const { accessToken, refreshToken } = generateTokens(user);
    await this.prisma.users.update({
      where: {email: email},
      data: {refresh_token: refreshToken},
    });
    return { accessToken, refreshToken, user };
  }

  async refereshToken(token: string) {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await this.prisma.users.findUnique({
        where: {user_id: decoded.id},
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
