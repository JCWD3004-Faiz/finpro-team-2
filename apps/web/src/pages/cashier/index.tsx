import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchProducts } from '@/redux/slices/productSlice';
import { addItem, removeItem, updateItemQuantity, clearTransaction } from '@/redux/slices/transactionSlice';
import { getCurrentShift } from '@/redux/slices/shiftSlice';
import CashierLayout from '@/components/layouts/CashierLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Search, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function CashierPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.product);
  const { currentTransaction } = useAppSelector((state) => state.transaction);
  const { currentShift } = useAppSelector((state) => state.shift);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'debit'>('cash');
  const [debitCardNumber, setDebitCardNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(getCurrentShift());
  }, [dispatch]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: any) => {
    dispatch(addItem({ product, quantity: 1 }));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      dispatch(removeItem(productId));
    } else {
      dispatch(updateItemQuantity({ productId, quantity }));
    }
  };

  const handleCheckout = async () => {
    if (!currentShift) {
      setError('No active shift found. Please start a shift first.');
      return;
    }

    if (currentTransaction.items.length === 0) {
      setError('Cart is empty');
      return;
    }

    if (paymentMethod === 'debit' && !debitCardNumber) {
      setError('Please enter debit card number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Implement checkout logic here
      dispatch(clearTransaction());
      router.push('/cashier/receipt');
    } catch (err: any) {
      setError(err.message || 'Failed to process transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!currentShift) {
    return (
      <CashierLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No Active Shift</CardTitle>
              <p className="text-muted-foreground mb-4">
                Please start a shift to begin processing transactions
              </p>
              <Button onClick={() => router.push('/cashier/shift')}>
                Start Shift
              </Button>
            </CardContent>
          </Card>
        </div>
      </CashierLayout>
    );
  }

  return (
    <CashierLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">New Transaction</h1>
            <p className="text-muted-foreground">
              Add products to cart and process payment
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4" onClick={() => handleAddToCart(product)}>
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  )}
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">{formatCurrency(product.price)}</span>
                    <span className={`text-sm ${
                      product.stock < 10 ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shopping Cart</CardTitle>
            </CardHeader>
            <CardContent>
              {currentTransaction.items.length === 0 ? (
                <div className="text-center py-6">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentTransaction.items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => dispatch(removeItem(item.productId))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(currentTransaction.totalAmount)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Payment Method</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Button
                          type="button"
                          variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('cash')}
                        >
                          Cash
                        </Button>
                        <Button
                          type="button"
                          variant={paymentMethod === 'debit' ? 'default' : 'outline'}
                          onClick={() => setPaymentMethod('debit')}
                        >
                          Debit Card
                        </Button>
                      </div>
                    </div>

                    {paymentMethod === 'debit' && (
                      <div className="space-y-2">
                        <label htmlFor="cardNumber" className="text-sm font-medium">
                          Card Number
                        </label>
                        <Input
                          id="cardNumber"
                          value={debitCardNumber}
                          onChange={(e) => setDebitCardNumber(e.target.value)}
                          placeholder="Enter 16-digit card number"
                          maxLength={16}
                        />
                      </div>
                    )}

                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}

                    <Button
                      className="w-full"
                      onClick={handleCheckout}
                      isLoading={loading}
                    >
                      Process Payment
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </CashierLayout>
  );
}