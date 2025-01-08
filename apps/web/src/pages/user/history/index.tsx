import React, { useEffect, useState } from 'react';
import { UserSidebar } from '@/components/UserSideBar';
import { TransactionCard } from '@/components/transaction-card';
import { RootState, AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '@/hooks/useAuth';
import { fetchPaymentHistory, setStatus } from '@/redux/slices/userPaymentSlice';
import LoadingVignette from '@/components/LoadingVignette';
import Pagination from '@/components/pagination';
import SelectFilter from '@/components/selectFilter';

function TransactionHistory() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAuth();
  const user_id = Number(user?.id);
  const { payments, loading, error, currentPage, totalPages, status } = useSelector(
    (state: RootState) => state.userPayment
  );
  const [page, setPage] = useState(currentPage || 1);
  const limit = 5;

  useEffect(() => {
    if (user_id) {
      dispatch(fetchPaymentHistory({ user_id, page, limit, status }));
    }
  }, [dispatch, user_id, page, limit, status]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    dispatch(setStatus(newStatus));
    dispatch(fetchPaymentHistory({ user_id, page, limit, status: newStatus }));
  };

  const statusOptions = [
    { value: 'ORDER_CONFIRMED', label: 'Confirmed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  console.log('Selected status:', status);

  return (
    <div className="min-h-screen w-screen bg-white mt-[11vh] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <UserSidebar />
          <main className="flex-1">
            <div className="mb-6">
            <div className="flex justify-between">
              <div>
              <h1 className="text-2xl text-gray-800 font-semibold">Transaction History</h1>
              <p className="text-muted-foreground mb-6">Showing your recent transactions</p>
              </div>
              <div>
                <SelectFilter
                  label="All Statuses"
                  value={status || 'none'}
                  options={statusOptions}
                  onChange={handleStatusChange}
                />
              </div>
              </div>
              {loading ? (
                <div>
                  <LoadingVignette />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Error: {error}</p>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No transactions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((transaction: any) => (
                    <TransactionCard key={transaction.transaction_id} transaction={transaction} />
                  ))}
                </div>
              )}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default TransactionHistory;
