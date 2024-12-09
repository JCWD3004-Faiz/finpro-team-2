import { PrismaClient } from "@prisma/client";
import {
  userPendingSchema,
  resetPasswordSchema,
} from "../validators/user.auth.validator";
import {
  generateVerifiationToken,
  generateResetPasswordToken,
} from "../utils/user.auth.utils";

const JWT_SECRET = process.env.JWT_SECRET as string;
export class SendEmailService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private updatePendingUser(
    pendingUser: any,
    validatedData: { username: string; email: string },
    verificationToken: string,
    expiresAt: Date
  ) {
    return this.prisma.pendingRegistrations.update({
      where: { email: validatedData.email },
      data: {
        username: validatedData.username,
        verification_token: verificationToken,
        expires_at: expiresAt,
        attempts: { increment: 1 },
        last_attempt: new Date(),
        is_blocked: pendingUser.attempts >= 4,
      },
    });
  }

  async checkExistingEmailAndUser(email: string, username: string) {
    const existingUserByEmail = await this.prisma.users.findUnique({
      where: { email: email },
    });

    if (existingUserByEmail) {
      throw new Error("Email is already in use.");
    }
    const existingUserByUsername = await this.prisma.users.findUnique({
      where: { username: username },
    });

    if (existingUserByUsername) {
      throw new Error("Username is already in use.");
    }
  }

  async checkSSOLogin(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email: email },
      include: { UserAuthProviders: true },
    });
    if (!user) {
      throw new Error("User does not exist");
    }
    if (user.UserAuthProviders?.length > 0) {
      throw new Error("Not allowed for users who use SSO login.");
    }
    return user;
  }

  async checkBlockStatus(pendingUser: any, email: string) {
    if (pendingUser?.is_blocked) {
      const lastAttemptTime = pendingUser.last_attempt;
      const blockPeriod = 1 * 60 * 1000; // 1 minute block period
      const elapsedTime =
        new Date().getTime() - new Date(lastAttemptTime).getTime();

      if (elapsedTime < blockPeriod) {
        throw new Error(
          "You have exceeded the maximum number of attempts. Please try again in 1 minute."
        );
      }

      // Unblock the user and reset attempts after 1 minute
      await this.prisma.pendingRegistrations.update({
        where: { email: email },
        data: {
          is_blocked: false, // Unblock the user
          attempts: 0, // Reset attempts
        },
      });
    }
  }

  async sendResetPasswordEmail(email: string) {
    const validatedEmail = resetPasswordSchema.parse({ email });
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
    const verificationToken = generateResetPasswordToken({
      email: validatedEmail.email,
    });

    const user = await this.checkSSOLogin(validatedEmail.email);

    const pendingUser = await this.prisma.pendingRegistrations.findUnique({
      where: { email: validatedEmail.email },
    });

    if (!pendingUser) {
      return this.prisma.pendingRegistrations.create({
        data: {
          email: validatedEmail.email,
          username: user.username || null,
          verification_token: verificationToken,
          expires_at: expiresAt,
          attempts: 1,
          last_attempt: new Date(),
        },
      });
    }
    await this.checkBlockStatus(pendingUser, validatedEmail.email);

    return this.prisma.pendingRegistrations.update({
      where: { email: validatedEmail.email },
      data: {
        verification_token: verificationToken,
        expires_at: expiresAt,
        attempts: { increment: 1 },
        last_attempt: new Date(),
        is_blocked: pendingUser.attempts >= 4,
      },
    });
  }

  async userPendingRegister(data: { username: string; email: string }) {
    const validatedData = userPendingSchema.parse(data);
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
    const verificationToken = generateVerifiationToken(data);
    await this.checkExistingEmailAndUser(data.email, data.username);
    const pendingUser = await this.prisma.pendingRegistrations.findUnique({
      where: { email: validatedData.email },
    });

    if (!pendingUser) {
      return this.prisma.pendingRegistrations.create({
        data: {
          email: validatedData.email,
          username: validatedData.username || null,
          verification_token: verificationToken,
          expires_at: expiresAt,
          attempts: 1,
          last_attempt: new Date(),
        },
      });
    }

    await this.checkBlockStatus(pendingUser, validatedData.email);

    return this.updatePendingUser(
      pendingUser,
      validatedData,
      verificationToken,
      expiresAt
    );
  }

  async sendVerifyEmail(data: { username: string; email: string }) {
    const validatedData = userPendingSchema.parse(data);
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
    const verificationToken = generateVerifiationToken(data);
    const pendingUser = await this.prisma.pendingRegistrations.findUnique({
      where: { email: validatedData.email },
    });

    if (!pendingUser) {
      return this.prisma.pendingRegistrations.create({
        data: {
          email: validatedData.email,
          username: validatedData.username || null,
          verification_token: verificationToken,
          expires_at: expiresAt,
          attempts: 1,
          last_attempt: new Date(),
        },
      });
    }
    await this.checkBlockStatus(pendingUser, validatedData.email);
    return this.updatePendingUser(
      pendingUser,
      validatedData,
      verificationToken,
      expiresAt
    );
  }
}
