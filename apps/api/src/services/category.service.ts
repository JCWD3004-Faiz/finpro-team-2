import { PrismaClient } from "@prisma/client";
import { categorySchema } from "../validators/category.validator";

export class CategoryService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  private async checkCategoryId(category_id: number) {
    const exist = await this.prisma.categories.findUnique({
      where: { category_id },
    });
    if (!exist) {
      throw new Error("Invalid category ID: No matching category ID found");
    }
  }

  async getCategories() {
    const categories = await this.prisma.categories.findMany({
      where: {
        is_deleted: false,
      },
      select: {
        category_id: true,
        category_name: true,
      },
    });
    return categories;
  }

  async getAllCategoryNameId() {
    const categories = await this.prisma.categories.findMany({
      select: {
        category_id: true,
        category_name: true,
      },
    });
    return categories;
  }

  async getAllCategory(
    page: number = 1,
    pageSize: number = 10,
    search: string = ""
  ) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const categories = await this.prisma.categories.findMany({
      where: {
        category_name: {
          contains: search,
          mode: "insensitive",
        },
      },
      skip,
      take,
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });
    const totalItems = await this.prisma.categories.count({});
    return {
      data: categories.map((category) => ({
        category_id: category.category_id,
        category_name: category.category_name,
        totalProducts: category._count.products,
        is_deleted: category.is_deleted,
        created_at: category.created_at,
      })),
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    };
  }

  async createCategory(category_name: string) {
    const data = { category_name };
    const validatedCategoryName = categorySchema.parse(data);
    return await this.prisma.categories.create({
      data: {
        category_name: validatedCategoryName.category_name,
      },
    });
  }

  async updateCategory(category_id: number, category_name: string) {
    const data = { category_name };
    const validatedCategoryName = categorySchema.parse(data);
    this.checkCategoryId(category_id);
    return await this.prisma.categories.update({
      where: { category_id },
      data: {
        category_name: validatedCategoryName.category_name,
      },
    });
  }

  async deleteCategory(category_id: number) {
    this.checkCategoryId(category_id);
    return await this.prisma.categories.update({
      where: { category_id },
      data: {
        is_deleted: true,
      },
    });
  }
}
