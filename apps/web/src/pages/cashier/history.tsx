import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getTransactionHistory } from '@/redux/slices/transactionSlice';
import { useQueryParams } from '@/lib/useQueryParams';
import CashierLayout from '@/components/layouts/CashierLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Receipt, Search, Calendar } from 'lucide-react';

export default function TransactionHistoryPage() {
  const dispatch = useAppDispatch();
  const { transactionHistory, loading } = useAppSelector((state) => state.transaction);
  
  const { params, updateParams, resetParams } = useQueryParams({
    startDate: '',
    endDate: '',
    paymentMethod: '',
    minAmount: '',
    maxAmount: '',
  });

  useEffect(() => {
    dispatch(getTransactionHistory(params));
  }, [dispatch, params]);

  return (
    <CashierLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground">
            View your past transactions
          </p>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={params.startDate}
                      onChange={(e) => updateParams({ startDate: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      value={params.endDate}
                      onChange={(e) => updateParams({ endDate: e.target.value })}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <select
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                  value={params.paymentMethod}
                  onChange={(e) => updateParams({ paymentMethod: e.target.value })}
                >
                  <option value="">All Methods</option>
                  <option value="cash">Cash</option>
                  <option value="debit">Debit</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Amount Range</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={params.minAmount}
                    onChange={(e) => updateParams({ minAmount: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={params.maxAmount}
                    onChange={(e) => updateParams({ maxAmount: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={resetParams}
                className="mr-2"
              >
                Reset Filters
              </Button>
              <Button
                onClick={() => dispatch(getTransactionHistory(params))}
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : transactionHistory.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Receipt className="w-12 h-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No transactions found</CardTitle>
              <p className="text-muted-foreground">
                {Object.values(params).some(Boolean)
                  ? 'Try adjusting your filters'
                  : 'Start making sales to see your transaction history'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {transactionHistory.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Transaction #{transaction.id}
                      </p>
                      <p className="font-medium">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Payment Method
                      </p>
                      <p className="font-medium capitalize">
                        {transaction.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {transaction.transactionDetails.map((detail) => (
                      <div
                        key={detail.productId}
                        className="flex justify-between items-center text-sm"
                      >
                        <div>
                          <p className="font-medium">{detail.product.name}</p>
                          <p className="text-muted-foreground">
                            {formatCurrency(detail.price)} × {detail.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatCurrency(detail.price * detail.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t mt-4 pt-4 flex justify-between items-center">
                    <p className="font-bold">Total</p>
                    <p className="font-bold text-lg">
                      {formatCurrency(transaction.totalAmount)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </CashierLayout>
  );
}