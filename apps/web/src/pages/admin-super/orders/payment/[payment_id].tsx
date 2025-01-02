import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchSuperPayment, fetchSuperCartItems } from '@/redux/slices/managePaymentSlice';
import SuperSidebar from '@/components/SuperSidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PaymentProofSection } from '@/components/paymentProof';
import LoadingVignette from '@/components/LoadingVignette';
import { CartItemsTable } from '@/components/cartItemsTable';

function PaymentManagement() {
  const params = useParams();
  const payment_id = Number(params?.payment_id);
  const dispatch = useDispatch<AppDispatch>();
  const { isSidebarOpen } = useSelector((state: RootState) => state.superAdmin);
  const { payment, cartItems, loading, error } = useSelector((state: RootState) => state.managePayment);

  const toggleSidebar = () => {
    dispatch({ type: 'storeAdmin/toggleSidebar' });
  };

  useEffect(() => {
    if (payment_id) {
      dispatch(fetchSuperPayment({payment_id}));
    }
  }, [dispatch, payment_id]);

  useEffect(() => {
    if (payment?.Order?.order_id) {
      dispatch(fetchSuperCartItems({ order_id: payment.Order.order_id }));
    }
  }, [dispatch, payment]);

  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <SuperSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {loading && <LoadingVignette />}
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64 p-6 relative`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          Manage Payment
        </h1>
        {error && <p className="text-red-600">{error}</p>}
        {!loading && payment && (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-medium">{payment?.transaction_id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">{payment?.payment_method.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c:any) => c.toUpperCase())}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">Rp. {payment?.total_price}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(payment?.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className={`font-medium ${payment?.payment_status === 'COMPLETED' ? 'text-emerald-600' : payment?.payment_status === 'FAILED' && 'CANCELLED' ? 'text-rose-600' : 'text-orange-600'}`}>
                        {payment?.payment_status}
                    </p>
                  </div>
                  {payment?.payment_reference && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Payment Reference</p>
                      <p className="font-medium">{payment?.payment_reference}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium">Proof of Payment</h4>
                  <PaymentProofSection proof={payment} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <CartItemsTable items={cartItems} />
      </div>
    </div>
  );
}

export default PaymentManagement;
