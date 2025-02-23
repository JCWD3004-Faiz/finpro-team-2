import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import {
  BarChart3,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

const reportTypes = [
  {
    title: 'Daily Sales',
    description: 'View detailed sales data for any specific day',
    icon: DollarSign,
    href: '/admin/reports/daily',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    title: 'Product Sales',
    description: 'Analyze sales performance by product',
    icon: ShoppingBag,
    href: '/admin/reports/products',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    title: 'Cashier Performance',
    description: 'Review individual cashier performance metrics',
    icon: Users,
    href: '/admin/reports/cashiers',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    title: 'Shift Reports',
    description: 'View shift-wise transaction data',
    icon: Calendar,
    href: '/admin/reports/shifts',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    title: 'Sales Trends',
    description: 'Analyze sales trends over time',
    icon: TrendingUp,
    href: '/admin/reports/trends',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    title: 'Inconsistency Reports',
    description: 'Review cash handling discrepancies',
    icon: AlertTriangle,
    href: '/admin/reports/inconsistencies',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reportTypes.filter((report) =>
    report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-muted-foreground">
              Generate and view detailed reports for your business
            </p>
          </div>
          <Button>
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        <div className="relative">
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => {
            const Icon = report.icon;
            return (
              <Link key={report.href} href={report.href}>
                <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className={`${report.bgColor} p-3 rounded-lg`}>
                        <Icon className={`w-6 h-6 ${report.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {report.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Sales
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp 4,550,000</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Cashiers
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                2 shifts in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Transactions
              </CardTitle>
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128</div>
              <p className="text-xs text-muted-foreground">
                +12 in last hour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Transaction
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp 35,500</div>
              <p className="text-xs text-muted-foreground">
                +5.2% from last week
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}