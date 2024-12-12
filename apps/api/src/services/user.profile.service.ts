import { PrismaClient } from "@prisma/client";
import cloudinary from "../config/cloudinary";

export class UserProfileService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  async updateUserProfilePic(data: { id: number; image: string }) {
    const uploadResponse = await cloudinary.uploader.upload(data.image, {
      folder: "userProfile",
    });
    return this.prisma.users.update({
      where: { user_id: data.id },
      data: {
        image: uploadResponse.secure_url,
      },
    });
  }
}
