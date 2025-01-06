import React, {useEffect} from 'react'
import { UserSidebar } from '@/components/UserSideBar';
import { TransactionCard } from '@/components/transaction-card';
import { RootState, AppDispatch } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '@/hooks/useAuth';
import { fetchPaymentHistory } from '@/redux/slices/userPaymentSlice'
import LoadingVignette from '@/components/LoadingVignette';



function TransactionHistory() {
    const dispatch = useDispatch<AppDispatch>();
    const user = useAuth();
    const user_id = Number(user?.id);
    const { payments, loading, error } = useSelector((state: RootState) => state.userPayment); 

    useEffect(() => {
        if (user_id){
            dispatch(fetchPaymentHistory(user_id));
        }
    }, [dispatch, user_id]);

  return (
    <div className="min-h-screen w-screen bg-white mt-[11vh] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <UserSidebar />
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl text-gray-800 font-semibold">Transaction History</h1>
              <p className="text-muted-foreground mb-6">Showing your recent transactions</p>
              {loading ? (
                <div> <LoadingVignette /> </div>
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
          </main>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory