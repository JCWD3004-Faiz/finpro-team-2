import { Shift, Transaction, Prisma, TransactionDetail, Product } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';

interface ShiftWithTransactions extends Shift {
  transactions: Transaction[];
}

interface ShiftTotals {
  cashTotal: Prisma.Decimal;
  debitTotal: Prisma.Decimal;
  transactionCount: number;
}

interface CurrentShift extends ShiftWithTransactions {
  currentTotals: ShiftTotals;
}

export class ShiftService {
  async startShift(cashierId: number, initialCash: number): Promise<Shift> {
    const activeShift = await prisma.shift.findFirst({
      where: {
        cashierId,
        status: 'active'
      }
    });

    if (activeShift) {
      throw new Error('You already have an active shift');
    }

    if (initialCash < 0) {
      throw new Error('Initial cash amount cannot be negative');
    }

    return prisma.shift.create({
      data: {
        cashierId,
        initialCash: new Decimal(initialCash),
        status: 'active'
      }
    });
  }

  async endShift(cashierId: number, finalCash: number): Promise<Shift> {
    const activeShift = await prisma.shift.findFirst({
      where: {
        cashierId,
        status: 'active'
      },
      include: {
        transactions: true
      }
    });

    if (!activeShift) {
      throw new Error('No active shift found');
    }

    if (finalCash < 0) {
      throw new Error('Final cash amount cannot be negative');
    }

    // Calculate expected cash
    const cashTransactions = activeShift.transactions
      .filter(t => t.paymentMethod === 'cash')
      .reduce((sum, t) => sum.add(t.totalAmount), new Decimal(0));

    const expectedCash = activeShift.initialCash.add(cashTransactions);
    const actualCash = new Decimal(finalCash);
    const difference = actualCash.sub(expectedCash);

    // Validate if difference is within acceptable range (optional)
    const MAX_ACCEPTABLE_DIFFERENCE = new Decimal(1000); // 1000 IDR tolerance
    if (difference.abs().greaterThan(MAX_ACCEPTABLE_DIFFERENCE)) {
      // Log the discrepancy but still allow ending the shift
      console.warn(`Large cash discrepancy detected for shift ${activeShift.id}: ${difference.toString()} IDR`);
    }

    // End shift with calculations
    return prisma.shift.update({
      where: { id: activeShift.id },
      data: {
        endTime: new Date(),
        finalCash: actualCash,
        expectedCash: expectedCash,
        cashDifference: difference,
        status: 'closed'
      }
    });
  }

  async getCurrentShift(cashierId: number): Promise<CurrentShift | null> {
    const shift = await prisma.shift.findFirst({
      where: {
        cashierId,
        status: 'active'
      },
      include: {
        transactions: {
          include: {
            transactionDetails: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    if (!shift) {
      throw new Error('No active shift found');
    }

    // Calculate current totals
    const totals = shift.transactions.reduce(
      (acc, transaction) => {
        if (transaction.paymentMethod === 'cash') {
          acc.cashTotal = acc.cashTotal.add(transaction.totalAmount);
        } else {
          acc.debitTotal = acc.debitTotal.add(transaction.totalAmount);
        }
        acc.transactionCount++;
        return acc;
      },
      {
        cashTotal: new Decimal(0),
        debitTotal: new Decimal(0),
        transactionCount: 0
      }
    );

    return {
      ...shift,
      currentTotals: totals
    };
  }

  async getShiftHistory(
    cashierId: number,
    filters?: {
      startDate?: string;
      endDate?: string;
      hasDiscrepancy?: boolean;
    }
  ): Promise<ShiftWithTransactions[]> {
    const where: Prisma.ShiftWhereInput = {
      cashierId,
      status: 'closed',
      ...(filters?.startDate && {
        startTime: { gte: new Date(filters.startDate) }
      }),
      ...(filters?.endDate && {
        endTime: { lte: new Date(filters.endDate) }
      }),
      ...(filters?.hasDiscrepancy && {
        cashDifference: { not: 0 }
      })
    };

    return prisma.shift.findMany({
      where,
      include: {
        transactions: true
      },
      orderBy: {
        startTime: 'desc'
      }
    });
  }
}