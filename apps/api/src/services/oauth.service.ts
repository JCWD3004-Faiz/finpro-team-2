import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import config from "../config/config";
import { oauthUser } from "../models/oauth.models";

const prisma = new PrismaClient();
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

export class OauthService {
  constructor() {
    this.initializeGoogleStrategy();
  }

  private initializeGoogleStrategy(): void {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: `${config.NEXT_PUBLIC_BASE_URL}/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const user = {
              id: profile.id,
              displayName: profile.displayName,
              email: profile.emails && profile.emails[0]?.value,
            };
            done(null, user);
          } catch (error) {
            done(error, undefined);
          }
        }
      )
    );

    passport.serializeUser((user: any, done) => {
      done(null, user);
    });

    passport.deserializeUser((user: any, done) => {
      done(null, user);
    });
  }

  async findOrCreateUser(user: oauthUser) {
    let savedUser = await prisma.users.findUnique({
      where: { email: user.email },
    });
    if (!savedUser) {
      savedUser = await prisma.users.create({
        data: {
          username: user.displayName,
          email: user.email,
          is_verified: true,
          role: "USER",
          updated_at: new Date(),
        },
      });
      await prisma.userAuthProviders.create({
        data: {
          user_id: savedUser.user_id,
          provider_name: "GOOGLE",
          provider_user_id: user.providerUserId,
        },
      });
    }
    return savedUser;
  }

  async updateRefreshToken(userEmail: string, refreshToken: string) {
    await prisma.users.update({
      where: { email: userEmail },
      data: { refresh_token: refreshToken },
    });
  }
}

export default new OauthService();
