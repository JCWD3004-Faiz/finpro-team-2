import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getCashiers } from '@/redux/slices/adminSlice';
import { useQueryParams } from '@/lib/useQueryParams';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Plus, Search, Users, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function CashiersPage() {
  const dispatch = useAppDispatch();
  const { cashiers, loading } = useAppSelector((state) => state.admin);
  
  const { params, updateParams, resetParams } = useQueryParams({
    search: '',
    status: '',
    sortBy: 'username',
    sortOrder: 'asc' as 'asc' | 'desc',
  });

  useEffect(() => {
    dispatch(getCashiers(params));
  }, [dispatch, params]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cashiers</h1>
            <p className="text-muted-foreground">
              Manage your store's cashiers
            </p>
          </div>
          <Link href="/admin/cashiers/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Cashier
            </Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium">Search</label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search cashiers..."
                    value={params.search}
                    onChange={(e) => updateParams({ search: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                  value={params.status}
                  onChange={(e) => updateParams({ status: e.target.value })}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Sort By</label>
                <select
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                  value={`${params.sortBy}-${params.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    updateParams({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
                  }}
                >
                  <option value="username-asc">Name (A-Z)</option>
                  <option value="username-desc">Name (Z-A)</option>
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={resetParams}
                className="mr-2"
              >
                Reset Filters
              </Button>
              <Button
                onClick={() => dispatch(getCashiers(params))}
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : cashiers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No cashiers found</CardTitle>
              <p className="text-muted-foreground">
                {params.search
                  ? 'Try adjusting your search query'
                  : 'Get started by adding your first cashier'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cashiers.map((cashier) => (
              <Link
                key={cashier.id}
                href={`/admin/cashiers/${cashier.id}`}
                className="block"
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold truncate">
                          {cashier.username}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1" />
                          Joined {formatDate(cashier.createdAt)}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cashier.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {cashier.status}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Sales</p>
                        <p className="font-medium">
                          {cashier.totalSales} transactions
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Active</p>
                        <p className="font-medium">
                          {cashier.lastActive
                            ? formatDate(cashier.lastActive)
                            : 'Never'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}