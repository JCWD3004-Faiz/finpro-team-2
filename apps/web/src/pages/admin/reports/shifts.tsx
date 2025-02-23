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
  Clock,
  DollarSign,
  AlertTriangle,
  Users,
  ArrowUpDown,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

// Mock data - replace with actual API data
const mockShiftReport = {
  startDate: '2024-03-01',
  endDate: '2024-03-10',
  summary: {
    totalShifts: 24,
    totalSales: 45500000,
    averageShiftSales: 1895833,
    cashDiscrepancies: 3,
    totalCashiers: 4,
  },
  shifts: [
    {
      id: 1,
      cashier: {
        id: 1,
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      startTime: '2024-03-10T09:00:00',
      endTime: '2024-03-10T17:00:00',
      initialCash: 500000,
      finalCash: 2800000,
      expectedCash: 2750000,
      transactions: 42,
      sales: {
        total: 2250000,
        cash: 1575000,
        debit: 675000,
      },
      status: 'closed',
      hasDiscrepancy: true,
    },
    {
      id: 2,
      cashier: {
        id: 2,
        name: 'Jane Smith',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
      startTime: '2024-03-10T08:00:00',
      endTime: '2024-03-10T16:00:00',
      initialCash: 500000,
      finalCash: 2500000,
      expectedCash: 2500000,
      transactions: 38,
      sales: {
        total: 2000000,
        cash: 1400000,
        debit: 600000,
      },
      status: 'closed',
      hasDiscrepancy: false,
    },
    // Add more shifts as needed
  ],
};

export default function ShiftReportsPage() {
  const [startDate, setStartDate] = useState(mockShiftReport.startDate);
  const [endDate, setEndDate] = useState(mockShiftReport.endDate);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'sales' | 'transactions'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterDiscrepancies, setFilterDiscrepancies] = useState(false);

  const handleSort = (key: 'date' | 'sales' | 'transactions') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const filteredShifts = mockShiftReport.shifts
    .filter((shift) => {
      const matchesSearch = shift.cashier.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDiscrepancy = filterDiscrepancies ? shift.hasDiscrepancy : true;
      return matchesSearch && matchesDiscrepancy;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc'
          ? new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          : new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      }
      if (sortBy === 'sales') {
        return sortOrder === 'asc'
          ? a.sales.total - b.sales.total
          : b.sales.total - a.sales.total;
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
              <h1 className="text-2xl font-bold tracking-tight">Shift Reports</h1>
              <p className="text-muted-foreground">
                Analyze shift performance and cash handling
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockShiftReport.summary.totalShifts}
              </div>
              <p className="text-xs text-muted-foreground">
                By {mockShiftReport.summary.totalCashiers} cashiers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockShiftReport.summary.totalSales)}
              </div>
              <p className="text-xs text-muted-foreground">
                All shifts combined
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Shift Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockShiftReport.summary.averageShiftSales)}
              </div>
              <p className="text-xs text-muted-foreground">
                Per shift
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Cashiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockShiftReport.summary.totalCashiers}
              </div>
              <p className="text-xs text-muted-foreground">
                During this period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Discrepancies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {mockShiftReport.summary.cashDiscrepancies}
              </div>
              <p className="text-xs text-muted-foreground">
                Cash handling issues
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by cashier name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={filterDiscrepancies ? 'default' : 'outline'}
            onClick={() => setFilterDiscrepancies(!filterDiscrepancies)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Show Discrepancies Only
          </Button>
        </div>

        {/* Shift List */}
        <Card>
          <CardHeader>
            <CardTitle>Shift Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-7 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
                <div className="col-span-2">
                  <button
                    className="flex items-center"
                    onClick={() => handleSort('date')}
                  >
                    Cashier & Time
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
                <div>Cash Sales</div>
                <div>Cash Balance</div>
                <div>Status</div>
              </div>
              <div className="divide-y">
                {filteredShifts.map((shift) => (
                  <div key={shift.id} className="grid grid-cols-7 gap-4 p-4">
                    <div className="col-span-2">
                      <div className="flex items-center space-x-3">
                        <img
                          src={shift.cashier.avatar}
                          alt={shift.cashier.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{shift.cashier.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(shift.startTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {formatCurrency(shift.sales.total)}
                    </div>
                    <div className="flex items-center">
                      {shift.transactions} txns
                    </div>
                    <div className="flex items-center">
                      {formatCurrency(shift.sales.cash)}
                    </div>
                    <div className="flex items-center">
                      <div>
                        <p className="font-medium">
                          {formatCurrency(shift.finalCash)}
                        </p>
                        {shift.hasDiscrepancy && (
                          <p className="text-sm text-red-600">
                            {formatCurrency(shift.finalCash - shift.expectedCash)} diff
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {shift.hasDiscrepancy ? (
                        <div className="flex items-center text-red-600">
                          <XCircle className="w-4 h-4 mr-1" />
                          Discrepancy
                        </div>
                      ) : (
                        <div className="flex items-center text-green-600">
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Balanced
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}