import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { startShift, endShift, getCurrentShift } from '@/redux/slices/shiftSlice';
import CashierLayout from '@/components/layouts/CashierLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Clock, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ShiftPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { currentShift, loading } = useAppSelector((state) => state.shift);
  const [initialCash, setInitialCash] = useState('');
  const [finalCash, setFinalCash] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getCurrentShift());
  }, [dispatch]);

  const handleStartShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!initialCash || Number(initialCash) <= 0) {
      setError('Please enter a valid initial cash amount');
      return;
    }

    try {
      await dispatch(startShift(Number(initialCash))).unwrap();
      router.push('/cashier');
    } catch (err: any) {
      setError(err.message || 'Failed to start shift');
    }
  };

  const handleEndShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!finalCash || Number(finalCash) <= 0) {
      setError('Please enter a valid final cash amount');
      return;
    }

    try {
      await dispatch(endShift(Number(finalCash))).unwrap();
      router.push('/cashier');
    } catch (err: any) {
      setError(err.message || 'Failed to end shift');
    }
  };

  return (
    <CashierLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Shift Management</h1>
          <p className="text-muted-foreground">
            Start or end your shift
          </p>
        </div>

        {currentShift ? (
          <Card>
            <CardHeader>
              <CardTitle>Current Shift</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Started At</span>
                  <p className="font-medium">{formatDate(currentShift.startTime)}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Initial Cash</span>
                  <p className="font-medium">{formatCurrency(currentShift.initialCash)}</p>
                </div>
              </div>

              <form onSubmit={handleEndShift} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="finalCash" className="text-sm font-medium">
                    Final Cash Amount
                  </label>
                  <Input
                    id="finalCash"
                    type="number"
                    min="0"
                    step="0.01"
                    value={finalCash}
                    onChange={(e) => setFinalCash(e.target.value)}
                    placeholder="Enter final cash amount"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={loading}
                >
                  End Shift
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Start New Shift</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStartShift} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="initialCash" className="text-sm font-medium">
                    Initial Cash Amount
                  </label>
                  <Input
                    id="initialCash"
                    type="number"
                    min="0"
                    step="0.01"
                    value={initialCash}
                    onChange={(e) => setInitialCash(e.target.value)}
                    placeholder="Enter initial cash amount"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  isLoading={loading}
                >
                  Start Shift
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {currentShift && (
          <Card>
            <CardHeader>
              <CardTitle>Shift Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-medium">Duration</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {/* Calculate duration */}
                    4h 30m
                  </p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="font-medium">Total Sales</span>
                  </div>
                  <p className="text-2xl font-bold mt-2">
                    {formatCurrency(0)} {/* Replace with actual total */}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </CashierLayout>
  );
}