import { PrismaClient } from "@prisma/client";

export class SalesService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }
  /**
   * Get monthly sales report
   * @param year - The year for the report (e.g., 2024)
   * @param storeId - Optional store_id filter; if null, fetch data for all stores
   * @returns Monthly sales report with total sales for each month
   */
  async getMonthlySalesReport(year: number, storeId?: number) {
    const filters: any = {
      order_status: { in: ["PROCESSING", "SENT", "ORDER_CONFIRMED"] },
      created_at: {
        gte: new Date(`${year}-01-01T00:00:00Z`),
        lte: new Date(`${year}-12-31T23:59:59Z`),
      },
    };

    if (storeId) {
      filters.store_id = storeId;
    }

    // Fetch all rows
    const orders = await this.prisma.orders.findMany({
      where: filters,
      select: {
        created_at: true,
        cart_price: true,
      },
    });

    // Group and aggregate in JavaScript
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const month = `${year}-${String(index + 1).padStart(2, "0")}`;
      const totalSales = orders
        .filter((order) => new Date(order.created_at).getMonth() === index)
        .reduce((sum, order) => sum + order.cart_price.toNumber(), 0);

      return {
        month,
        total_sales: totalSales,
      };
    });

    return monthlyData;
  }

  async getMonthlySalesByCategory(
    year: number,
    storeId?: number,
    categoryId?: number
  ) {
    // Default to category_id = 1 (Vegetables) if no category is selected
    const selectedCategoryId = categoryId || 1;

    const filters: any = {
      created_at: {
        gte: new Date(`${year}-01-01T00:00:00Z`),
        lte: new Date(`${year}-12-31T23:59:59Z`),
      },
      order_status: { in: ["PROCESSING", "SENT", "ORDER_CONFIRMED"] },
    };

    if (storeId) {
      filters.store_id = storeId;
    }

    // Fetch data grouped by month for the selected category
    const salesData = await this.prisma.orders.findMany({
        where: filters,
        include: {
          Cart: {
            include: {
              CartItems: {
                where: {
                  Inventory: {
                    Product: {
                      category_id: selectedCategoryId, // Apply the filter here
                    },
                  },
                },
                include: {
                  Inventory: {
                    include: {
                      Product: {
                        include: {
                          Category: {
                            select: {
                                category_id: true,
                              category_name: true,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      

    // Aggregate sales by month
    const monthlySales = salesData.reduce((acc, order) => {
      order.Cart?.CartItems?.forEach((item) => {
        const itemCategory = item.Inventory?.Product?.Category;
        const orderMonth = new Date(order.created_at).toISOString().slice(0, 7); // Extract YYYY-MM
        const itemTotal = item.quantity * item.product_price.toNumber();

        if (itemCategory?.category_id === selectedCategoryId) {
          acc[orderMonth] = (acc[orderMonth] || 0) + itemTotal;
        }
      });

      return acc;
    }, {} as Record<string, number>);

    // Fill missing months with 0 sales
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const month = `${year}-${String(index + 1).padStart(2, "0")}`;
      return {
        month,
        total_sales: monthlySales[month] || 0,
      };
    });

    // Return data compatible with Chart.js
    const chartData = {
      labels: monthlyData.map((data) => data.month),
      datasets: [
        {
          label: `Sales for Category ID: ${selectedCategoryId}`,
          data: monthlyData.map((data) => data.total_sales),
        },
      ],
    };

    return chartData;
  }

  async getMonthlySalesByProduct(
    year: number,
    storeId?: number,
    productId?: number
  ) {
    // Get the first product if no productId is provided
    if (!productId) {
      const firstProduct = await this.prisma.products.findFirst({
        where: { is_deleted: false },
        select: { product_id: true },
        orderBy: { product_id: "asc" },
      });
      if (!firstProduct) {
        throw new Error("No products found in the database.");
      }
      productId = firstProduct.product_id;
    }

    // Define base filters
    const filters: any = {
      created_at: {
        gte: new Date(`${year}-01-01T00:00:00Z`),
        lte: new Date(`${year}-12-31T23:59:59Z`),
      },
      order_status: { in: ["PROCESSING", "SENT", "ORDER_CONFIRMED"] },
    };

    if (storeId) {
      filters.store_id = storeId;
    }

    // Fetch sales data for the selected product
    const salesData = await this.prisma.orders.findMany({
      where: filters,
      include: {
        Cart: {
          include: {
            CartItems: {
              where: {
                Inventory: {
                  product_id: productId,
                },
              },
              include: {
                Inventory: {
                  include: {
                    Product: {
                      select: {
                        product_id: true,
                        product_name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Aggregate sales by month
    const monthlySales = salesData.reduce((acc, order) => {
      order.Cart?.CartItems?.forEach((item) => {
        const product = item.Inventory?.Product;
        const orderMonth = new Date(order.created_at).toISOString().slice(0, 7); // YYYY-MM
        const itemTotal = item.quantity * item.product_price.toNumber();

        if (product) {
          acc[orderMonth] = (acc[orderMonth] || 0) + itemTotal;
        }
      });

      return acc;
    }, {} as Record<string, number>);

    // Format data for all months (1-12), filling missing months with 0 sales
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const month = `${year}-${String(index + 1).padStart(2, "0")}`;
      return {
        month, // e.g., "2024-01"
        total_sales: monthlySales[month] || 0,
      };
    });

    return monthlyData;
  }
}
