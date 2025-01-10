import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '@/hooks/useAuth';
import { RootState, AppDispatch } from '@/redux/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Truck } from 'lucide-react';
import { GrLocation } from 'react-icons/gr';
import LoadingVignette from '@/components/LoadingVignette';
import { fetchOrderDetails, setSelectedAddress, setSelectedShipping, updateAddress, updateShippingMethod, fetchShippingVouchers, redeemShippingVoucher } from '@/redux/slices/checkoutSlice';

function OrderOptions() {
  const router = useRouter();
  const params = useParams();
  const order_id = Number(params?.order_id);
  const user = useAuth();
  const user_id = Number(user?.id);
  const dispatch = useDispatch<AppDispatch>();
  const { orderDetails, selectedAddress, selectedShipping, newShippingPrice, loading, shippingVouchers } = useSelector((state: RootState) => state.checkout);
  const { addresses } = useSelector((state: RootState) => state.userProfile);
  const [isVoucherSelectVisible, setIsVoucherSelectVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<string | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  const shippingMethods = [
    { label: 'JNE', value: 'jne' },
    { label: 'POS', value: 'pos' },
    { label: 'TIKI', value: 'tiki' }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user_id && order_id) {
      dispatch(fetchOrderDetails({ user_id, order_id }));
      dispatch(fetchShippingVouchers(user_id));
    }
  }, [user_id, order_id, dispatch]);

  useEffect(() => {
    if (selectedAddress) {
      dispatch(updateAddress({ user_id, order_id, address_id: selectedAddress }));
    }
  }, [selectedAddress, dispatch]);

  useEffect(() => {
    if (selectedShipping) {
      dispatch(updateShippingMethod({ user_id, order_id, shipping_method: selectedShipping }));
    }
  }, [selectedShipping, dispatch]);

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  };

  const handleVoucherApply = () => {
    if (selectedVoucher) {
      dispatch(redeemShippingVoucher({ user_id, order_id, redeem_code:selectedVoucher}))
      alert(`Voucher ${selectedVoucher} applied!`);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white py-8 mt-[11vh]">
      {loading && <LoadingVignette />}
      {mounted && (
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Checkout Order</h1>
          <p className="mt-2 text-gray-600">Please confirm your shipping details before proceeding to payment</p>
        </div>
        <div className="space-y-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Order Details
            </CardTitle>
          </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-medium">
              {orderDetails?.store_name ? ( orderDetails.store_name ) : (
                <div className="w-[200px] h-[20px] bg-gray-200 rounded-md" />
              )}
            </p>
            <p className="text-sm text-muted-foreground">
            {orderDetails?.order_status ? (`Order Status: ${formatStatus(orderDetails?.order_status).toUpperCase()}` ) : (
              <div className="w-[200px] h-[20px] bg-gray-200 rounded-md" />
            )}
            </p>
            <p className="text-sm text-muted-foreground">
              {orderDetails?.created_at ? ( `Order Date: ${new Date(orderDetails?.created_at).toLocaleDateString(
                'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`) : (
                <div className="w-[200px] h-[20px] bg-gray-200 rounded-md" />
              )}
            </p>
          </div>
          </CardContent>
        </Card>
          <Card className='border-2'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GrLocation className="h-5 w-5" />
                Shipping Address
              </CardTitle>
              <CardDescription>Select where you want your groceries delivered</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedAddress} onValueChange={(value) => dispatch(setSelectedAddress(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select delivery address" />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((address) => (
                    <SelectItem key={address.address_id} value={address.address_id}>
                      {`${address.address}, ${address.city_name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className='border-2'>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Method
              </CardTitle>
              <CardDescription>Choose your preferred delivery option</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedShipping} onValueChange={(value) => dispatch(setSelectedShipping(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  {shippingMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{method.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent>
              <div className="space-y-4">
                <div className='font-semibold text-xl py-4 flex justify-between mt-2'>
                  <p className="">Shipping Price:</p>
                  <p>
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(Number(newShippingPrice))}
                  </p>
                </div>
                <div className="flex items-center">
                  <Button
                    size="lg"
                    onClick={() => {                      setIsVoucherSelectVisible(!isVoucherSelectVisible);
                      if (isVoucherSelectVisible && selectedVoucher) {
                        handleVoucherApply();
                      }
                    }}
                    disabled={!selectedAddress || !selectedShipping}
                  >
                    {isVoucherSelectVisible ? 'Apply Voucher' : 'Apply Shipping Voucher'}
                  </Button>
                  {isVoucherSelectVisible && (
                    <Select
                      value={selectedVoucher}
                      onValueChange={(value) => setSelectedVoucher(value)}
                    >
                      <SelectTrigger className="w-full ml-4 px-4">
                        <SelectValue placeholder="Select a shipping voucher" />
                      </SelectTrigger>
                      <SelectContent>
                        {shippingVouchers.map((voucher) => (
                          <SelectItem key={voucher.redeem_code} value={voucher.redeem_code}>
                            {voucher.redeem_code}
                            <label className="ml-4 text-muted-foreground">
                                {voucher.discount_type === 'PERCENTAGE' ? (
                                    `${voucher.discount_amount}% OFF`
                                ) : (
                                    `${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(voucher.discount_amount)} OFF`
                                )}
                        </label>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-end">
            <Button size="lg" disabled={!selectedAddress || !selectedShipping} onClick={() => { router.push(`/checkout/payment-form/${order_id}`) }}>
              Continue to Payment
            </Button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default OrderOptions;
