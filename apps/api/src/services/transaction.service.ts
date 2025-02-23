import { Transaction, TransactionDetail, Product, PaymentType, Prisma, Shift } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import prisma from '../config/database';

interface TransactionItem {
  productId: number;
  quantity: number;
}

interface CreateTransactionData {
  shiftId: number;
  cashierId: number;
  items: TransactionItem[];
  paymentMethod: PaymentType;
  debitCardNumber?: string;
  cashAmount?: number;
}

interface TransactionWithDetails extends Transaction {
  transactionDetails: (TransactionDetail & {
    product: Product;
  })[];
}

interface TransactionResult {
  transaction: TransactionWithDetails;
  change?: Prisma.Decimal;
  expectedCash?: Prisma.Decimal;
}

interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  paymentMethod?: PaymentType;
  minAmount?: number;
  maxAmount?: number;
}

export class TransactionService {
  async createTransaction(data: CreateTransactionData): Promise<TransactionResult> {
    const { shiftId, cashierId, items, paymentMethod, debitCardNumber, cashAmount } = data;

    // Validate shift
    const shift = await prisma.shift.findFirst({
      where: { id: shiftId, status: 'active', cashierId }
    });

    if (!shift) {
      throw new Error('No active shift found');
    }

    // Validate items array
    if (!items.length) {
      throw new Error('Transaction must contain at least one item');
    }

    // Calculate total and validate stock
    let totalAmount = new Decimal(0);
    const transactionDetails = [];

    for (const item of items) {
      if (item.quantity <= 0) {
        throw new Error('Item quantity must be greater than 0');
      }

      const product = await prisma.product.findFirst({
        where: { id: item.productId, isDeleted: false }
      });

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const itemTotal = product.price.mul(item.quantity);
      totalAmount = totalAmount.add(itemTotal);

      transactionDetails.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Validate payment
    if (paymentMethod === 'cash') {
      if (!cashAmount) {
        throw new Error('Cash amount is required for cash payments');
      }
      
      const cashDecimal = new Decimal(cashAmount);
      if (cashDecimal.lessThan(0)) {
        throw new Error('Cash amount cannot be negative');
      }
      
      if (cashDecimal.lessThan(totalAmount)) {
        throw new Error('Insufficient cash amount');
      }

      // Validate maximum cash amount to prevent errors
      const MAX_CASH_AMOUNT = new Decimal(100000000); // 100 million IDR
      if (cashDecimal.greaterThan(MAX_CASH_AMOUNT)) {
        throw new Error('Cash amount exceeds maximum limit');
      }
    } else if (paymentMethod === 'debit') {
      if (!debitCardNumber) {
        throw new Error('Debit card number is required');
      }

      // Validate debit card number format (16 digits)
      if (!/^\d{16}$/.test(debitCardNumber)) {
        throw new Error('Invalid debit card number format');
      }
    }

    // Create transaction and update stock in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          shiftId,
          cashierId,
          totalAmount,
          paymentMethod,
          debitCardNumber,
          transactionDetails: {
            create: transactionDetails
          }
        },
        include: {
          transactionDetails: {
            include: {
              product: true
            }
          }
        }
      });

      // Update stock
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return transaction;
    });

    // Calculate change and expected cash for cash payments
    let change: Decimal | undefined;
    let expectedCash: Decimal | undefined;

    if (paymentMethod === 'cash' && cashAmount) {
      change = new Decimal(cashAmount).sub(totalAmount);
      
      // Update shift's expected cash calculation
      const shiftTransactions = await prisma.transaction.findMany({
        where: { 
          shiftId,
          paymentMethod: 'cash'
        }
      });

      expectedCash = shiftTransactions.reduce(
        (sum, t) => sum.add(t.totalAmount),
        shift.initialCash
      );
    }

    return { 
      transaction: result,
      change,
      expectedCash
    };
  }

  async getTransactionHistory(
    cashierId: number,
    filters: TransactionFilters = {}
  ): Promise<TransactionWithDetails[]> {
    const { startDate, endDate, paymentMethod, minAmount, maxAmount } = filters;

    const where: Prisma.TransactionWhereInput = {
      cashierId,
      ...(startDate && {
        createdAt: { gte: new Date(startDate) }
      }),
      ...(endDate && {
        createdAt: { lte: new Date(endDate) }
      }),
      ...(paymentMethod && {
        paymentMethod
      }),
      ...(minAmount !== undefined && {
        totalAmount: { gte: new Decimal(minAmount) }
      }),
      ...(maxAmount !== undefined && {
        totalAmount: { lte: new Decimal(maxAmount) }
      })
    };

    return prisma.transaction.findMany({
      where,
      include: {
        transactionDetails: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getTransactionDetails(id: number): Promise<TransactionWithDetails> {
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        cashier: {
          select: {
            id: true,
            username: true
          }
        },
        shift: true,
        transactionDetails: {
          include: {
            product: true
          }
        }
      }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }
}