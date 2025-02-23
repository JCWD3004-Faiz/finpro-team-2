// Update the products page to use query params
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchProducts } from '@/redux/slices/productSlice';
import { useQueryParams } from '@/lib/useQueryParams';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Search, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.product);
  
  const { params, updateParams, resetParams } = useQueryParams({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: '',
  });

  useEffect(() => {
    dispatch(fetchProducts(params));
  }, [dispatch, params]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
              Manage your store's products
            </p>
          </div>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="text-sm font-medium">Search</label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={params.search}
                    onChange={(e) => updateParams({ search: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                  value={params.category}
                  onChange={(e) => updateParams({ category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  <option value="beverages">Beverages</option>
                  <option value="food">Food</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Price Range</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={params.minPrice}
                    onChange={(e) => updateParams({ minPrice: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={params.maxPrice}
                    onChange={(e) => updateParams({ maxPrice: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Stock Status</label>
                <select
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                  value={params.inStock}
                  onChange={(e) => updateParams({ inStock: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
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
                onClick={() => dispatch(fetchProducts(params))}
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                {params.search
                  ? 'Try adjusting your search query'
                  : 'Get started by adding your first product'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="block"
              >
                <Card className="h-full transition-shadow hover:shadow-md">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {product.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">
                        {formatCurrency(product.price)}
                      </span>
                      <span className={`text-sm ${
                        product.stock < 10 ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {product.stock} in stock
                      </span>
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