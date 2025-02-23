import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  ShoppingBag,
  ArrowUpDown
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

// Mock data - replace with actual API data
const mockTrendsReport = {
  startDate: '2024-03-01',
  endDate: '2024-03-10',
  summary: {
    totalSales: 45500000,
    growth: 15.8,
    averageDaily: 4550000,
    bestDay: {
      date: '2024-03-08',
      sales: 6800000
    },
    worstDay: {
      date: '2024-03-02',
      sales: 3200000
    }
  },
  dailySales: [
    { date: '2024-03-01', sales: 4200000, transactions: 115 },
    { date: '2024-03-02', sales: 3200000, transactions: 98 },
    { date: '2024-03-03', sales: 4800000, transactions: 132 },
    { date: '2024-03-04', sales: 5100000, transactions: 142 },
    { date: '2024-03-05', sales: 4900000, transactions: 138 },
    { date: '2024-03-06', sales: 5500000, transactions: 155 },
    { date: '2024-03-07', sales: 5200000, transactions: 148 },
    { date: '2024-03-08', sales: 6800000, transactions: 182 },
    { date: '2024-03-09', sales: 5800000, transactions: 165 },
    { date: '2024-03-10', sales: 4550000, transactions: 128 }
  ],
  hourlyDistribution: [
    { hour: '08:00', percentage: 5 },
    { hour: '09:00', percentage: 8 },
    { hour: '10:00', percentage: 10 },
    { hour: '11:00', percentage: 12 },
    { hour: '12:00', percentage: 15 },
    { hour: '13:00', percentage: 14 },
    { hour: '14:00', percentage: 11 },
    { hour: '15:00', percentage: 9 },
    { hour: '16:00', percentage: 8 },
    { hour: '17:00', percentage: 6 },
    { hour: '18:00', percentage: 2 }
  ],
  categoryTrends: [
    {
      category: 'Beverages',
      sales: 15500000,
      growth: 18.5,
      trend: 'up'
    },
    {
      category: 'Food',
      sales: 12800000,
      growth: 12.3,
      trend: 'up'
    },
    {
      category: 'Snacks',
      sales: 9200000,
      growth: -5.2,
      trend: 'down'
    },
    {
      category: 'Others',
      sales: 8000000,
      growth: 8.7,
      trend: 'up'
    }
  ]
};

export default function SalesTrendsPage() {
  const [startDate, setStartDate] = useState(mockTrendsReport.startDate);
  const [endDate, setEndDate] = useState(mockTrendsReport.endDate);
  const [sortBy, setSortBy] = useState<'date' | 'sales' | 'transactions'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: 'date' | 'sales' | 'transactions') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const sortedDailySales = [...mockTrendsReport.dailySales].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    if (sortBy === 'sales') {
      return sortOrder === 'asc'
        ? a.sales - b.sales
        : b.sales - a.sales;
    }
    return sortOrder === 'asc'
      ? a.transactions - b.transactions
      : b.transactions - a.transactions;
  });

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
              <h1 className="text-2xl font-bold tracking-tight">Sales Trends</h1>
              <p className="text-muted-foreground">
                Analyze sales patterns and performance trends
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

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">
                  {formatCurrency(mockTrendsReport.summary.totalSales)}
                </div>
                <div className={`flex items-center text-sm ${
                  mockTrendsReport.summary.growth >= 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {mockTrendsReport.summary.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(mockTrendsReport.summary.growth)}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                vs. previous period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Daily Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockTrendsReport.summary.averageDaily)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per day
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Best Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockTrendsReport.summary.bestDay.sales)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(mockTrendsReport.summary.bestDay.date)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Worst Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockTrendsReport.summary.worstDay.sales)}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDate(mockTrendsReport.summary.worstDay.date)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Sales Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-4 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
                <div>
                  <button
                    className="flex items-center"
                    onClick={() => handleSort('date')}
                  >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </button>
                </div>
                <div>
                  <button
                    className="flex items-center"
                    onClick={() => handleSort('sales')}
                  >
                    Sales
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </button>
                </div>
                <div>
                  <button
                    className="flex items-center"
                    onClick={() => handleSort('transactions')}
                  >
                    Transactions
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </button>
                </div>
                <div>Avg. Transaction</div>
              </div>
              <div className="divide-y">
                {sortedDailySales.map((day) => (
                  <div key={day.date} className="grid grid-cols-4 gap-4 p-4">
                    <div>
                      <p className="font-medium">{formatDate(day.date)}</p>
                    </div>
                    <div>{formatCurrency(day.sales)}</div>
                    <div>{day.transactions} txns</div>
                    <div>{formatCurrency(day.sales / day.transactions)}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Hourly Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Hourly Sales Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockTrendsReport.hourlyDistribution.map((hour) => (
                  <div key={hour.hour} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{hour.hour}</span>
                      <span>{hour.percentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${hour.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockTrendsReport.categoryTrends.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{category.category}</p>
                        <div className={`flex items-center text-sm ${
                          category.growth >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {category.growth >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {Math.abs(category.growth)}% growth
                        </div>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(category.sales)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${
                          category.trend === 'up'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                        style={{
                          width: `${(category.sales / mockTrendsReport.summary.totalSales) * 100}%`
                        }}
                      />
                    </div>
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