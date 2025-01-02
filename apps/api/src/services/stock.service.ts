import { PrismaClient } from "@prisma/client";

export class StockService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getStockJournalByStoreId(
    store_id?: number,
    page: number = 1,
    pageSize: number = 10,
    sortOrder: "asc" | "desc" = "desc", // Default to descending order
    changeType?: string,
    search?: string // Search by product name
  ) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
  
    // Build the where condition dynamically
    const whereCondition: any = {
      ...(store_id && {
        Inventory: {
          store_id,
        },
      }),
      ...(changeType && {
        change_type: changeType,
      }),
      ...(search && {
        Inventory: {
          Product: {
            product_name: {
              contains: search,
              mode: "insensitive", // Case-insensitive search
            },
          },
        },
      }),
    };
  
    // Fetch the stock journal entries
    const stockJournalEntries = await this.prisma.stockJournal.findMany({
      where:
        Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
      skip,
      take,
      orderBy: {
        created_at: sortOrder,
      },
      include: {
        Inventory: {
          select: {
            store_id: true,
            Product: {
              select: {
                product_name: true,
              },
            },
          },
        },
      },
    });
  
    // Count total items
    const totalItems = await this.prisma.stockJournal.count({
      where:
        Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
    });
  
    // Return paginated response
    return {
      data: stockJournalEntries,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    };
  }
  
}
