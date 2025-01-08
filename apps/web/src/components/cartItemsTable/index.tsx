import React from 'react';
import { CartItem } from "@/utils/paymentProofTypes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface CartItemsTableProps {
  items: CartItem[];
}

export function CartItemsTable({ items }: CartItemsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Quantity</th>
                <th className="px-6 py-3 font-medium">Total Price</th>
                <th className="px-6 py-3 font-medium">Available Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.cart_item_id} className="bg-background">
                  <td className="px-6 py-4 font-medium">
                    {item.product_name}
                  </td>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(Number(item.product_price))}                  
                  </td>
                  <td className="px-6 py-4">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(Number((item.product_price) * item.quantity))}                  
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${
                      item.stock_available < 10 ? 'text-destructive' : ''
                    }`}>
                      {item.stock_available}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}