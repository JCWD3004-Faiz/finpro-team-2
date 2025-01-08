import React, { useEffect } from 'react';
import { UserSidebar } from '@/components/UserSideBar';
import { OrderStatus } from '@/components/order-status';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, cancelOrder, confirmOrder } from '@/redux/slices/userPaymentSlice';
import LoadingVignette from '@/components/LoadingVignette';
import useAuth from '@/hooks/useAuth';
import { RootState, AppDispatch } from '@/redux/store';
import ErrorModal from "@/components/modal-error";
import SuccessModal from "@/components/modal-success";
import { showError, hideError } from "@/redux/slices/errorSlice";
import { showSuccess, hideSuccess } from "@/redux/slices/successSlice";
import ConfirmationModal from '@/components/modal-confirm';
import { showConfirmation, hideConfirmation } from '@/redux/slices/confirmSlice';

function OrderTracking() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAuth();
  const user_id = Number(user?.id);

  const { isErrorOpen, errorMessage } = useSelector((state: RootState) => state.error);
  const { isSuccessOpen, successMessage } = useSelector((state: RootState) => state.success); 
  const { isConfirmationOpen, confirmationMessage, onConfirm } = useSelector((state: RootState) => state.confirm); 
  const { orders, loading, error } = useSelector((state: RootState) => state.userPayment);

  useEffect(() => {
    if (user_id) {
      dispatch(fetchOrders(user_id));
    }
  }, [dispatch, user_id]);

  const handleCancelOrder = (order_id: number) => {
    dispatch(showConfirmation({
      message: 'Are you sure you want to cancel this order?',
      onConfirm: async () => {
        try {
          await dispatch(cancelOrder({ user_id, order_id })).unwrap();
          dispatch(showSuccess('Your order has been canceled.'));
        } catch (error) {
          dispatch(showError('Failed to cancel order. Please try again later.'));
        }
        dispatch(hideConfirmation());
      },
    }));
  };

  const handleConfirmOrder = (order_id: number) => {
    dispatch(showConfirmation({
      message: 'Has your order been successfully delivered?',
      onConfirm: async () => {
        try {
          await dispatch(confirmOrder({ user_id, order_id })).unwrap();
          dispatch(showSuccess('Order confirmed! Thank you for shopping at FrugMart!'));
        } catch (error) {
          dispatch(showError('Failed to confirm order. Please try again later.'));
        }
        dispatch(hideConfirmation());
      },
    }));
  };

  return (
    <div className="min-h-screen w-screen bg-white mt-[7vh] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <UserSidebar />
          {loading && <LoadingVignette />}
          <ErrorModal isOpen={isErrorOpen} onClose={() => dispatch(hideError())} errorMessage={errorMessage}/>
          <SuccessModal isOpen={isSuccessOpen} onClose={() => {dispatch(hideSuccess()); window.location.reload()}} successMessage={successMessage}/>
          <ConfirmationModal isOpen={isConfirmationOpen} onClose={() => dispatch(hideConfirmation())} onConfirm={onConfirm as () => void} message={confirmationMessage!}/>
          <main className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl text-gray-800 font-semibold">Ongoing Orders</h1>
              <p className="text-muted-foreground">Track your current orders</p>
            </div>
            <div className="space-y-12 text-gray-800">
              {loading ? (
                <div> <LoadingVignette /> </div> 
              ) :error || !orders || orders.length === 0 ? (
                <p>You currently have no ongoing orders.</p>
              ) : (
                orders.map((order:any) => (
                  <div key={order.order_id} className="bg-white rounded-lg p-6 text-gray-800 md:mx-12"
                  style={{ boxShadow: '0 -1px 6px rgba(0, 0, 0, 0.1), 0 4px 3px rgba(0, 0, 0, 0.08)' }}>
                    <div className="mb-8">
                      <OrderStatus status={order.order_status} />
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Order Date</span>
                          <span className="font-medium">{new Date(order.created_at).toLocaleDateString(
                            "en-US", {year: "numeric", month: "long", day: "numeric"})}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium pt-2">
                          <span>Cart Total</span>
                          <span>Rp. {order.cart_price}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Shipping Method</span>
                          <span className="font-mono">{order.shipping_method.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Destination</span>
                          <span>{order.address}, {order.city_name}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2">
                          <span>Shipping Cost</span>
                          <span>Rp. {order.shipping_price}</span>
                        </div>
                      </div>
                      {order.order_status === 'PENDING_PAYMENT' && (
                        <button onClick={() => handleCancelOrder(order.order_id)}
                        className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-red-600">
                          Cancel Order
                        </button>
                      )}
                      {order.order_status === 'SENT' && (
                        <button onClick={() => handleConfirmOrder(order.order_id)} 
                        className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-green-600">
                          Confirm Order
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
