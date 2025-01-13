import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Store, Truck, CreditCard, Upload } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import useAuth from '@/hooks/useAuth';
import { fetchOrderDetails, submitPayment, createVABankTransfer } from '@/redux/slices/checkoutSlice';
import { useParams } from 'next/navigation';
import LoadingVignette from '@/components/LoadingVignette';
import Cookies from 'js-cookie';
import ErrorModal from "@/components/modal-error";
import SuccessModal from "@/components/modal-success";
import { showError, hideError } from "@/redux/slices/errorSlice";
import { showSuccess, hideSuccess } from "@/redux/slices/successSlice";

function PaymentForm() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const order_id = Number(params?.order_id);
  const user = useAuth();
  const user_id = Number(user?.id);
  const { orderDetails, loading, paymentError } = useSelector((state: RootState) => state.checkout);
  const [date, setDate] = useState<Date>();
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [popImage, setPopImage] = useState<File | null>(null);
  const [errorText, setErrorText] = useState<string>('');
  const [mounted, setMounted] = useState(false);
  const { isErrorOpen, errorMessage } = useSelector((state: RootState) => state.error);
  const { isSuccessOpen, successMessage } = useSelector((state: RootState) => state.success); 

  Cookies.set('payment_order_id', order_id.toString(), { expires: 7, path: '/checkout' });

  useEffect(() => {
    if (user_id && order_id) {
      dispatch(fetchOrderDetails({ user_id, order_id }));
    }
  }, [user_id, order_id, dispatch]);

  useEffect(() => {
    setMounted(true);
  }, []);  

  const cartPrice = orderDetails?.cart_price ? parseFloat(String(orderDetails.cart_price)) : 0;
  const shippingPrice = orderDetails?.shipping_price ? parseFloat(String(orderDetails.shipping_price)) : 0;
  const total = cartPrice + shippingPrice;

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPopImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod || !date || (paymentMethod !== 'MIDTRANS' && !popImage)) {
      setErrorText('Please fill all the required fields');
      return;
    }
    const dateString = date.toISOString();
    if (paymentMethod === 'MANUAL_TRANSFER') {
      dispatch(submitPayment({ user_id, order_id, paymentMethod, date: dateString, popImage }))
        .unwrap()
        .then(() => {
        dispatch(showSuccess('Payment submitted successfully!'));  
        })
        .catch((error: any) => {
          dispatch(showError(error || paymentError || 'Failed to submit payment'));
        });
    } else if (paymentMethod === 'MIDTRANS') {
      try {
        const paymentResponse = await dispatch(submitPayment({
          user_id,
          order_id,
          paymentMethod,
          date: dateString,
          popImage,
        })).unwrap();
        const transaction_id = paymentResponse.data.payment.transaction_id;
        if (!transaction_id) { throw new Error('Transaction ID not found in payment response')}
        const vaResponse = await dispatch(createVABankTransfer({
          user_id,
          transaction_id,
        })).unwrap();
        const redirect_url = vaResponse?.redirect_url;
        if (!redirect_url) { throw new Error('Redirect URL not found in VA Bank Transfer response')}
        alert('Redirecting to Midtrans...');
        window.location.href = redirect_url;
      } catch (error: any) {
        dispatch(showError(error?.message || 'An error occurred during payment processing'));
      }
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white py-8 mt-[11vh]">
      {loading && <LoadingVignette />}
      <ErrorModal isOpen={isErrorOpen} onClose={() => dispatch(hideError())} errorMessage={errorMessage}/>
      <SuccessModal isOpen={isSuccessOpen} onClose={() => {dispatch(hideSuccess()); window.location.href = "/"}} successMessage={successMessage}/>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Payment Submission</h1>
        <div className="grid gap-8 md:grid-cols-2">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              {mounted && orderDetails ? (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Store</span>
                    <span className="font-medium">{orderDetails.store_name}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Shipping Address</span>
                    <span className="font-medium text-right max-w-[200px]">{orderDetails.address}, {orderDetails.city_name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Order Status</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                      {formatStatus(orderDetails.order_status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Shipping Method</span>
                    <span className="font-medium flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      {orderDetails.shipping_method.toUpperCase()}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cart Total</span>
                    <span className="font-medium">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(orderDetails.cart_price))}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <span className="font-medium">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(orderDetails.shipping_price))}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(total))}</span>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Store</span>
                    <div className="w-[200px] h-[20px] bg-gray-200 rounded-md" />
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Shipping Address</span>
                    <div className="w-[200px] h-[20px] bg-gray-200 rounded-md" />
                  </div>
                  <div className="flex justify-end items-center">
                    <div className="w-[100px] h-[20px] bg-gray-200 rounded-md" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Order Status</span>
                    <div className="w-[100px] h-[20px] bg-gray-200 rounded-md" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Shipping Method</span>
                    <div className="w-[100px] h-[20px] bg-gray-200 rounded-md" />
                  </div>
                </div>
                <Separator/>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cart Total</span>
                    <div className="w-[120px] h-[20px] bg-gray-200 rounded-md" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Shipping Fee</span>
                    <div className="w-[120px] h-[20px] bg-gray-200 rounded-md" />
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <div className="w-[120px] h-[20px] bg-gray-200 rounded-md" />
                  </div>
                </div>
              </CardContent>
            )}
            </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MANUAL_TRANSFER">Manual Transfer</SelectItem>
                    <SelectItem value="MIDTRANS">Midtrans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Proof of Payment</label>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Input
                    id="payment-proof"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    disabled={paymentMethod === 'MIDTRANS'}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : <><Upload className="mr-2 h-4 w-4" /> Submit Payment</>}
              </Button>
              {errorText && <div className="text-red-600 text-sm">{errorText}</div>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PaymentForm;
