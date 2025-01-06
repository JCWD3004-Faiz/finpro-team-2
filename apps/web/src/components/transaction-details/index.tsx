import { CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ItemDetails {
    cart_item_id: string;
    product_name: string;
    quantity: number;
    product_price: number;
    original_price: number;
}
  
interface TransactionDetailsProps {
  items: ItemDetails[];
  payment_reference: string | null,
  address: string,
  city_name: string,
  shipping_price: number,
  cart_price: number,
}

export function TransactionDetails({ items, payment_reference, address, city_name, shipping_price, cart_price }: TransactionDetailsProps) {
  const total = items.reduce((sum, item) => sum + item.original_price * item.quantity, 0);
  const totalDiscount = Number(total) - Number(cart_price)

  return (
    <div>
      {payment_reference && (
        <div>
          <h3 className="text-base font-semibold">Payment Reference</h3>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <p>{payment_reference}</p>
          </div>
        </div>
      )}
    <div className="space-y-6 mt-4">
      <div>
        <h3 className="text-lg font-semibold ">Cart Items</h3>
        <div className="relative">
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-1">
              {items.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="font-medium truncate">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-medium">Rp. {item.original_price}</p>
                    <p className="text-sm text-muted-foreground">
                      Subtotal: Rp. {item.product_price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex justify-between items-center pt-2 border-t pr-4">
          <p>Cart Price</p>
          <p>Rp. {total}</p>
        </div>
        <div className="flex justify-between items-center pr-4">
          <p>Discount Amount</p>
          <p>- Rp. {totalDiscount}</p>
        </div>
        <div className="flex justify-between items-center pt-2 font-semibold pr-4">
          <p>Cart Total</p>
          <p>Rp. {cart_price}</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex justify-between items-center font-semibold pr-4">
          <p>Shipping Price</p>
          <p>Rp. {shipping_price}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">Billing Address:</p>
          <p>{address}, {city_name}</p>
        </div>
      </div>
    </div>
    </div>
  );
}