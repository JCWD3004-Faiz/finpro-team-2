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
    sortOrder: "asc" | "desc" = "desc", 
    changeType?: string,
    search?: string
  ) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
  
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
              mode: "insensitive", 
            },
          },
        },
      }),
    };
  
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
          include: {
            Product: {
              select: {
                product_name: true,
              },
            },
            Store: {
              select: {
                store_name: true,
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
  
    return {
      data: stockJournalEntries.map((stockJournalEntry) => ({
        journal_id: stockJournalEntry.journal_id,
        inventory_id: stockJournalEntry.inventory_id,
        inventory_name: stockJournalEntry.Inventory.Product.product_name,
        store_name: stockJournalEntry.Inventory.Store.store_name,
        change_type: stockJournalEntry.change_type,
        change_quantity: stockJournalEntry.change_quantity,
        prev_stock: stockJournalEntry.prev_stock,
        new_stock: stockJournalEntry.new_stock,
        change_category: stockJournalEntry.change_category,
        created_at: stockJournalEntry.created_at,
      })),
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    };
  }
  
}
