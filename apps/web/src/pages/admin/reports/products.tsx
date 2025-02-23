import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Download, Search, TrendingUp, TrendingDown, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

// Mock data - replace with actual API data
const mockProductReport = {
  startDate: '2024-03-01',
  endDate: '2024-03-10',
  totalRevenue: 15500000,
  totalUnitsSold: 450,
  categories: [
    { name: 'Beverages', revenue: 5500000, units: 180 },
    { name: 'Food', revenue: 4800000, units: 120 },
    { name: 'Snacks', revenue: 3200000, units: 95 },
    { name: 'Others', revenue: 2000000, units: 55 },
  ],
  products: [
    {
      id: 1,
      name: 'Product A',
      category: 'Beverages',
      price: 20000,
      unitsSold: 85,
      revenue: 1700000,
      growth: 15.5,
      stock: 150,
      imageUrl: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&w=200&h=200',
    },
    {
      id: 2,
      name: 'Product B',
      category: 'Food',
      price: 35000,
      unitsSold: 65,
      revenue: 2275000,
      growth: -8.2,
      stock: 80,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&h=200',
    },
    // Add more products as needed
  ],
};

export default function ProductSalesReportPage() {
  const [startDate, setStartDate] = useState(mockProductReport.startDate);
  const [endDate, setEndDate] = useState(mockProductReport.endDate);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = mockProductReport.products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
              <h1 className="text-2xl font-bold tracking-tight">Product Sales Report</h1>
              <p className="text-muted-foreground">
                Analyze product performance and sales trends
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
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockProductReport.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                From {mockProductReport.totalUnitsSold} units sold
              </p>
            </CardContent>
          </Card>

          {mockProductReport.categories.map((category) => (
            <Card key={category.name}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(category.revenue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {category.units} units sold
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {mockProductReport.categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-video relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Package className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.growth >= 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="flex items-center">
                      {product.growth >= 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {Math.abs(product.growth)}%
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">{formatCurrency(product.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Units Sold</p>
                    <p className="font-medium">{product.unitsSold}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="font-medium">{formatCurrency(product.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Stock</p>
                    <p className={`font-medium ${
                      product.stock < 20 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {product.stock} units
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}