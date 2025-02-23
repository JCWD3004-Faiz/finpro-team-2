import { UserRole, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { config } from '../config/config';

interface CashierFilters {
  search?: string;
  status?: 'active' | 'inactive';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class AdminService {
  async getCashiers(filters: CashierFilters = {}) {
    const { search, status, sortBy = 'username', sortOrder = 'asc' } = filters;

    const where: Prisma.UserWhereInput = {
      role: UserRole.cashier,
      ...(search && {
        username: { contains: search, mode: 'insensitive' }
      }),
      ...(status && {
        status: status
      })
    };

    const orderBy: Prisma.UserOrderByWithRelationInput = {
      [sortBy]: sortOrder
    };

    return prisma.user.findMany({
      where,
      orderBy,
      select: {
        id: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
        lastActive: true,
        _count: {
          select: {
            transactions: true
          }
        }
      }
    });
  }

  async createCashier(data: {
    username: string;
    password: string;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username }
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, config.bcryptSaltRounds);

    return prisma.user.create({
      data: {
        username: data.username,
        passwordHash,
        role: UserRole.cashier
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true
      }
    });
  }

  async updateCashier(id: number, data: { username?: string; password?: string }) {
    const cashier = await prisma.user.findFirst({
      where: { id, role: UserRole.cashier }
    });

    if (!cashier) {
      throw new Error('Cashier not found');
    }

    if (data.username) {
      const existingUser = await prisma.user.findFirst({
        where: { username: data.username, NOT: { id } }
      });

      if (existingUser) {
        throw new Error('Username already exists');
      }
    }

    return prisma.user.update({
      where: { id },
      data: {
        ...(data.username && { username: data.username }),
        ...(data.password && {
          passwordHash: await bcrypt.hash(data.password, config.bcryptSaltRounds)
        })
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true
      }
    });
  }

  async deleteCashier(id: number) {
    const cashier = await prisma.user.findFirst({
      where: { id, role: UserRole.cashier }
    });

    if (!cashier) {
      throw new Error('Cashier not found');
    }

    return prisma.user.delete({ where: { id } });
  }

  async getDailySalesReport(date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        transactionDetails: true,
        cashier: {
          select: {
            username: true
          }
        }
      }
    });

    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce(
      (sum, t) => sum.add(t.totalAmount),
      new Decimal(0)
    );

    return {
      date: startDate.toISOString().split('T')[0],
      totalTransactions,
      totalAmount,
      transactions
    };
  }

  async getProductSalesReport(startDate: string, endDate: string) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const productSales = await prisma.transactionDetail.groupBy({
      by: ['productId'],
      where: {
        transaction: {
          createdAt: {
            gte: start,
            lte: end
          }
        }
      },
      _sum: {
        quantity: true
      }
    });

    const productsWithSales = await Promise.all(
      productSales.map(async (sale) => {
        const product = await prisma.product.findUnique({
          where: { id: sale.productId }
        });
        return {
          product,
          totalQuantity: sale._sum.quantity,
          totalAmount: product!.price.mul(sale._sum.quantity || 0)
        };
      })
    );

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      products: productsWithSales
    };
  }

  async getShiftSalesReport(date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const shifts = await prisma.shift.findMany({
      where: {
        startTime: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        cashier: {
          select: {
            username: true
          }
        },
        transactions: {
          include: {
            transactionDetails: true
          }
        }
      }
    });

    return shifts.map(shift => ({
      shiftId: shift.id,
      cashier: shift.cashier.username,
      startTime: shift.startTime,
      endTime: shift.endTime,
      initialCash: shift.initialCash,
      finalCash: shift.finalCash,
      totalTransactions: shift.transactions.length,
      totalAmount: shift.transactions.reduce(
        (sum, t) => sum.add(t.totalAmount),
        new Decimal(0)
      ),
      debitTotal: shift.transactions
        .filter(t => t.paymentMethod === 'debit')
        .reduce((sum, t) => sum.add(t.totalAmount), new Decimal(0))
    }));
  }

  async getInconsistentTransactions(startDate: string, endDate: string) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const shifts = await prisma.shift.findMany({
      where: {
        startTime: {
          gte: start,
          lte: end
        },
        status: 'closed'
      },
      include: {
        cashier: {
          select: {
            username: true
          }
        },
        transactions: true
      }
    });

    return shifts
      .map(shift => {
        const cashTransactions = shift.transactions
          .filter(t => t.paymentMethod === 'cash')
          .reduce((sum, t) => sum.add(t.totalAmount), new Decimal(0));

        const expectedCash = shift.initialCash.add(cashTransactions);
        const actualCash = shift.finalCash || new Decimal(0);
        const difference = actualCash.sub(expectedCash);

        return {
          shiftId: shift.id,
          cashier: shift.cashier.username,
          date: shift.startTime.toISOString().split('T')[0],
          initialCash: shift.initialCash,
          expectedCash,
          actualCash,
          difference,
          isInconsistent: !difference.equals(0)
        };
      })
      .filter(report => report.isInconsistent);
  }
}