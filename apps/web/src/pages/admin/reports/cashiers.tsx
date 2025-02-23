import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  ArrowLeft,
  Download,
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  DollarSign,
  ShoppingBag,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

// Mock data - replace with actual API data
const mockCashierReport = {
  startDate: '2024-03-01',
  endDate: '2024-03-10',
  totalSales: 45500000,
  totalTransactions: 1280,
  cashiers: [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      performance: {
        totalSales: 15800000,
        transactions: 420,
        averageTransaction: 37619,
        shiftCount: 8,
        hoursWorked: 64,
        cashDiscrepancies: 2,
        topProducts: [
          { name: 'Product A', quantity: 85, revenue: 1700000 },
          { name: 'Product B', quantity: 65, revenue: 2275000 },
        ],
        salesTrend: [
          { date: '2024-03-01', sales: 1800000 },
          { date: '2024-03-02', sales: 2100000 },
          { date: '2024-03-03', sales: 1950000 },
          // Add more dates as needed
        ],
        paymentMethods: {
          cash: 11060000,
          debit: 4740000,
        },
        growth: 12.5,
      }
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      performance: {
        totalSales: 16200000,
        transactions: 445,
        averageTransaction: 36404,
        shiftCount: 8,
        hoursWorked: 64,
        cashDiscrepancies: 1,
        topProducts: [
          { name: 'Product C', quantity: 78, revenue: 1560000 },
          { name: 'Product D', quantity: 72, revenue: 2520000 },
        ],
        salesTrend: [
          { date: '2024-03-01', sales: 1900000 },
          { date: '2024-03-02', sales: 2200000 },
          { date: '2024-03-03', sales: 2100000 },
          // Add more dates as needed
        ],
        paymentMethods: {
          cash: 11340000,
          debit: 4860000,
        },
        growth: 15.8,
      }
    },
    // Add more cashiers as needed
  ]
};

export default function CashierPerformanceReportPage() {
  const [startDate, setStartDate] = useState(mockCashierReport.startDate);
  const [endDate, setEndDate] = useState(mockCashierReport.endDate);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCashier, setSelectedCashier] = useState<number | null>(null);

  const filteredCashiers = mockCashierReport.cashiers.filter((cashier) =>
    cashier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCashierData = selectedCashier
    ? mockCashierReport.cashiers.find(c => c.id === selectedCashier)
    : null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/reports">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Cashier Performance</h1>
              <p className="text-muted-foreground">
                Analyze individual cashier performance metrics
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-auto"
            />
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-auto"
            />
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Overall Summary */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockCashierReport.totalSales)}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockCashierReport.totalTransactions} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Cashiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockCashierReport.cashiers.length}
              </div>
              <p className="text-xs text-muted-foreground">
                In selected period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  mockCashierReport.totalSales / mockCashierReport.totalTransactions
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Per transaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cash Discrepancies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {mockCashierReport.cashiers.reduce(
                  (sum, c) => sum + c.performance.cashDiscrepancies,
                  0
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Reported issues
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cashier List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCashiers.map((cashier) => (
            <Card
              key={cashier.id}
              className={`cursor-pointer transition-shadow hover:shadow-md ${
                selectedCashier === cashier.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedCashier(
                selectedCashier === cashier.id ? null : cashier.id
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={cashier.avatar}
                    alt={cashier.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{cashier.name}</h3>
                    <div className={`flex items-center text-sm ${
                      cashier.performance.growth >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {cashier.performance.growth >= 0 ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {Math.abs(cashier.performance.growth)}% growth
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                    <p className="font-medium">
                      {formatCurrency(cashier.performance.totalSales)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="font-medium">{cashier.performance.transactions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hours Worked</p>
                    <p className="font-medium">{cashier.performance.hoursWorked}h</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Discrepancies</p>
                    <p className={`font-medium ${
                      cashier.performance.cashDiscrepancies > 0
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}>
                      {cashier.performance.cashDiscrepancies}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Cashier Performance */}
        {selectedCashierData && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cash Payments</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(
                          (selectedCashierData.performance.paymentMethods.cash /
                            selectedCashierData.performance.totalSales) * 100
                        )}% of total sales
                      </p>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(selectedCashierData.performance.paymentMethods.cash)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Debit Payments</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.round(
                          (selectedCashierData.performance.paymentMethods.debit /
                            selectedCashierData.performance.totalSales) * 100
                        )}% of total sales
                      </p>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(selectedCashierData.performance.paymentMethods.debit)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedCashierData.performance.topProducts.map((product, index) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.quantity} units sold
                        </p>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(product.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}