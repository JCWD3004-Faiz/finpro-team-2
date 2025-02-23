import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Download } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

// Mock data - replace with actual API data
const mockDailyReport = {
  date: '2024-03-10',
  totalSales: 4550000,
  totalTransactions: 128,
  averageTransaction: 35546.88,
  paymentMethods: {
    cash: 3200000,
    debit: 1350000,
  },
  hourlyBreakdown: [
    { hour: '09:00', sales: 450000, transactions: 12 },
    { hour: '10:00', sales: 680000, transactions: 18 },
    { hour: '11:00', sales: 820000, transactions: 25 },
    { hour: '12:00', sales: 950000, transactions: 28 },
    { hour: '13:00', sales: 750000, transactions: 20 },
    { hour: '14:00', sales: 500000, transactions: 15 },
    { hour: '15:00', sales: 400000, transactions: 10 },
  ],
  topProducts: [
    { name: 'Product A', quantity: 45, revenue: 900000 },
    { name: 'Product B', quantity: 32, revenue: 640000 },
    { name: 'Product C', quantity: 28, revenue: 560000 },
  ],
  cashiers: [
    { name: 'John Doe', transactions: 48, sales: 1800000 },
    { name: 'Jane Smith', transactions: 42, sales: 1500000 },
    { name: 'Bob Johnson', transactions: 38, sales: 1250000 },
  ],
};

export default function DailyReportPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

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
              <h1 className="text-2xl font-bold tracking-tight">Daily Sales Report</h1>
              <p className="text-muted-foreground">
                Detailed sales analysis for a specific day
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockDailyReport.totalSales)}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockDailyReport.totalTransactions} transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockDailyReport.averageTransaction)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per transaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Cash Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockDailyReport.paymentMethods.cash)}
              </div>
              <p className="text-xs text-muted-foreground">
                70.3% of total sales
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Debit Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockDailyReport.paymentMethods.debit)}
              </div>
              <p className="text-xs text-muted-foreground">
                29.7% of total sales
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Hourly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Hourly Sales Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockDailyReport.hourlyBreakdown.map((hour) => (
                <div
                  key={hour.hour}
                  className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <span className="font-medium">{hour.hour}</span>
                    <span className="text-muted-foreground">
                      {hour.transactions} transactions
                    </span>
                  </div>
                  <span className="font-medium">
                    {formatCurrency(hour.sales)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDailyReport.topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.quantity} units sold
                        </p>
                      </div>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cashier Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Cashier Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDailyReport.cashiers.map((cashier) => (
                  <div
                    key={cashier.name}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{cashier.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {cashier.transactions} transactions
                      </p>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(cashier.sales)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}