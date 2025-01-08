import React, {useEffect} from 'react'
import { UserSidebar } from '@/components/UserSideBar'
import { Clock, ShoppingBasket, Gift } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import useAuth from '@/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchUserVouchers } from '@/redux/slices/userPaymentSlice';
import LoadingVignette from '@/components/LoadingVignette';

function UserVouchers() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useAuth();
  const user_id = Number(user?.id);
  const { vouchers, loading, error } = useSelector((state: RootState) => state.userPayment);

  useEffect(() => {
    if (user_id) {
      dispatch(fetchUserVouchers(user_id));
    }
  }, [dispatch, user_id]);

  const voucherTypeMap: { [key: string]: string } = { "PRODUCT_DISCOUNT": "Product", "CART_DISCOUNT": "Cart", "SHIPPING_DISCOUNT": "Shipping" };


  return (
    <div className="min-h-screen w-screen bg-white mt-[11vh] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <UserSidebar />
          <main className="flex-1">
            <div className="mb-7">
              <h1 className="text-2xl text-gray-800 font-semibold">Vouchers</h1>
              <p className="text-muted-foreground">View your available vouchers</p>
            </div>
            {loading ? (
              <LoadingVignette />
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vouchers.length === 0 ? (
                  <div className="text-center py-12">
                    <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800">No Active Vouchers</h3>
                    <p className="text-muted-foreground">Check back later for new vouchers!</p>
                  </div>
                ) : (
                  vouchers.map((voucher, index) => (
                    <Card key={voucher.user_voucher_id} className="p-6 hover:shadow-lg transition-shadow animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-2xl font-bold font-mono">{voucher.redeem_code}</p>
                            <p className="text-sm text-muted-foreground mt-1">{voucherTypeMap[voucher.voucher_type]}</p>
                          </div>
                          <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-sm">
                            {voucher.discount_type === 'PERCENTAGE' 
                              ? `${voucher.discount_amount}% OFF`
                              : `${new Intl.NumberFormat("id-ID", { style: "currency", 
                              currency: "IDR", minimumFractionDigits: 0}).format(
                                Number(voucher.discount_amount))} OFF`}
                          </div>
                        </div>

                        <p className="text-sm text-foreground/80">{voucher.description}</p>

                        <div className="space-y-2">
                          {voucher.min_purchase && (
                            <div className="flex items-center gap-2 text-sm">
                              <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
                              <span>Min. spend: Rp. {voucher.min_purchase}</span>
                            </div>
                          )}

                          {voucher.max_discount && (
                            <div className="flex items-center gap-2 text-sm">
                              <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
                              <span>Max. discount: ${voucher.max_discount}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Expires {formatDistanceToNow(new Date(voucher.expiration_date), { addSuffix: true })}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default UserVouchers