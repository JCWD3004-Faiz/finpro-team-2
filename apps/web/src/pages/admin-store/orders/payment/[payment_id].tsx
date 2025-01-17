import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchPayment, fetchCartItems, setNewStatus, setEditingStatus, savePaymentStatus, processOrder } from '@/redux/slices/managePaymentSlice';
import StoreSidebar from '@/components/StoreSidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PaymentProofSection } from '@/components/paymentProof';
import LoadingVignette from '@/components/LoadingVignette';
import { CartItemsTable } from '@/components/cartItemsTable';
import { RiEdit2Fill, RiSave2Fill } from 'react-icons/ri';
import { MdCancel } from 'react-icons/md';
import ErrorModal from "@/components/modal-error";
import SuccessModal from "@/components/modal-success";
import { showError, hideError } from "@/redux/slices/errorSlice";
import { showSuccess, hideSuccess } from "@/redux/slices/successSlice";
import { IoSend } from 'react-icons/io5';

const paymentStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'];

function PaymentManagement() {
  const params = useParams();
  const payment_id = Number(params?.payment_id);
  const dispatch = useDispatch<AppDispatch>();
  const { isSidebarOpen } = useSelector((state: RootState) => state.storeAdmin);
  const { isErrorOpen, errorMessage } = useSelector((state: RootState) => state.error);
  const { isSuccessOpen, successMessage } = useSelector((state: RootState) => state.success);
  const { payment, cartItems, loading, newStatus, processing, editingStatus } = useSelector((state: RootState) => state.managePayment);
  const [isProcessed, setIsProcessed] = useState(false);

  const storeId = Cookies.get("storeId");
  const store_id = Number(storeId);

  const toggleSidebar = () => {
    dispatch({ type: 'storeAdmin/toggleSidebar' });
  };

  useEffect(() => {
    if (store_id && payment_id) {
      dispatch(fetchPayment({store_id, payment_id}));
    }
  }, [dispatch, store_id, payment_id]);

  useEffect(() => {
    if (payment?.Order?.order_id) {
      dispatch(fetchCartItems({ store_id, order_id: payment.Order.order_id }));
    }
  }, [dispatch, payment]);

  const handleSaveStatus = () => {
    if (newStatus !== payment?.payment_status) {
      dispatch(savePaymentStatus({ store_id, payment_id, newStatus }));
      window.location.reload();
    }
  };

  const handleProcessOrder = async () => {
    try {
      await dispatch(processOrder({ store_id, order_id: payment.Order.order_id })).unwrap();
      dispatch(showSuccess('Order processed successfully!'));
      setIsProcessed(true);
    } catch (error) {
      dispatch(showError('Failed to process the order'));
    }
  };

  return (
    <div className="bg-slate-100 w-screen min-h-screen text-gray-800">
      <StoreSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {loading && <LoadingVignette />}
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => dispatch(hideError())}
        errorMessage={errorMessage}
      />
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => dispatch(hideSuccess())}
        successMessage={successMessage}
      />
      <div className={`ml-0 ${isSidebarOpen ? 'md:ml-64' : ''} md:ml-64 p-6 relative`}>
        <h1 className="text-4xl font-semibold text-gray-900 mb-10 tracking-wide">
          Manage Payment
        </h1>
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
                    <p className="font-medium">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(Number(payment?.total_price))}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(payment?.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    {!editingStatus ? (
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-medium ${payment?.payment_status === 'COMPLETED' ? 'text-emerald-600' : payment?.payment_status === 'FAILED' && 'CANCELLED' ? 'text-rose-600' : 'text-orange-600'}`}
                        >
                          {payment?.payment_status}
                        </p>
                        <button
                          className="hover:text-gray-600"
                          onClick={() => dispatch(setEditingStatus(true))}
                        >
                          <RiEdit2Fill className="text-lg"/>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <select
                          value={newStatus}
                          onChange={(e) => dispatch(setNewStatus(e.target.value))}
                          className="border p-1 rounded-md"
                        >
                          {paymentStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button onClick={handleSaveStatus}>
                          <RiSave2Fill className="text-xl text-indigo-600 hover:text-indigo-500"/>
                        </button>
                        <button onClick={() => dispatch(setEditingStatus(false))}>
                          <MdCancel className="text-xl text-rose-600 hover:text-rose-500"/>
                        </button>
                      </div>
                    )}
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
            <div className="flex gap-4 mb-6">
              {payment?.payment_status === 'COMPLETED' && (
                <div className="flex items-center gap-4 p-4 bg-muted bg-white rounded-lg">
                  <span className="text-sm text-green-600">
                    ✓ Payment has been confirmed
                  </span>
                  <Button className="gap-2" onClick={handleProcessOrder} disabled={processing || isProcessed}>
                    <IoSend className="text-xl"/>
                    {isProcessed ? 'Order Processed' : (processing ? 'Processing...' : 'Process Order')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        <CartItemsTable items={cartItems} />
      </div>
    </div>
  );
}

export default PaymentManagement;
