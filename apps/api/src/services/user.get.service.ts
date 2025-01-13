import { PrismaClient } from "@prisma/client";

export class GetUserService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllUsers(
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    role: "SUPER_ADMIN" | "STORE_ADMIN" | "USER" | "" = ""
  ) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Define the `where` condition for searching by username
    const whereCondition: any = {
      ...(search && {
        username: {
          contains: search,
          mode: "insensitive", // Case-insensitive search
        },
      }),
      ...(role && { role }), // Filter by role if provided
    };

    // Fetch the users
    const users = await this.prisma.users.findMany({
      where: whereCondition, // If no search, fetch all
      skip,
      take,
      orderBy: {
        created_at: "desc", // Default sorting by creation date
      },
    });

    // Count the total number of users for pagination
    const totalItems = await this.prisma.users.count({
      where: whereCondition,
    });

    return {
      data: users.map((user) => ({
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        referral_code: user.referral_code,
        is_verified: user.is_verified,
        created_at: user.created_at,
        updated_at: user.updated_at,
      })),
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    };
  }
}
