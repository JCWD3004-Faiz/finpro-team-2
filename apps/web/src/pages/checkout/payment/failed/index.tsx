import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ShoppingBag, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { failedMidtransPaymentStatus } from '@/redux/slices/checkoutSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import useAuth from '@/hooks/useAuth';
import { fetchTransactionDetails } from '@/redux/slices/userPaymentSlice';
import Cookies from 'js-cookie';

function PaymentFailed() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = useAuth();
  const user_id = Number(user?.id);
  const [countdown, setCountdown] = useState(10);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { paymentDetails } = useSelector((state: RootState) => state.checkout);
  const { details } = useSelector((state: RootState) => state.userPayment);
  const order_id = Number(Cookies.get("payment_order_id"));

  useEffect(() => {
    if (user_id && order_id) {
      dispatch(fetchTransactionDetails({ user_id, order_id }));
    }
  }, [user_id, order_id, dispatch]);

  useEffect(() => {
    const transaction_id = String(details?.transaction_id);
    if (user_id && transaction_id) {
      dispatch(failedMidtransPaymentStatus({ user_id, transaction_id }));
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShouldRedirect(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [details, dispatch, user_id]);

  useEffect(() => {
    if (shouldRedirect) {
      Cookies.remove("payment_order_id", { path: '/checkout' })
      router.push('/');
    }
  }, [shouldRedirect, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-lg p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground">Payment Failed...</h1>
          
          <p className="text-muted-foreground">
            We're sorry, but your payment cannot be processed.
          </p>

          <div className="flex items-center space-x-2 text-muted-foreground">
            <Timer className="w-4 h-4" />
            <span>Redirecting in {countdown} seconds...</span>
          </div>

          <div className="w-full pt-4">
            <Button className="w-full gap-2" onClick={() => setShouldRedirect(true)}>
              <ShoppingBag className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
        <div className="border-t pt-6">
          <div className="space-y-2">
            <h2 className="font-semibold">Payment Details</h2>
            <div className="text-sm text-muted-foreground">
              {paymentDetails?.transaction_id && <p>Transaction ID: {paymentDetails?.transaction_id}</p>}
              {paymentDetails?.payment_method && <p>Payment Reference: N/A</p>}
              {paymentDetails?.payment_date && <p>Payment Date: {new Date(paymentDetails?.payment_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</p>}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PaymentFailed;