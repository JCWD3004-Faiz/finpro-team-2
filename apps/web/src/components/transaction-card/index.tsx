import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Truck, CreditCard, Store, Calendar, Receipt, Eye } from "lucide-react";
import { Transaction } from "@/utils/reduxInterface";
import { Button } from "../ui/button";
import { TransactionDetails } from "../transaction-details";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactionDetails } from "@/redux/slices/userPaymentSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { clearTransactionDetails } from "@/redux/slices/userPaymentSlice"; 

interface TransactionCardProps {
  transaction: Transaction;
}

const statusColors = {
  ORDER_CONFIRMED: "bg-green-100 text-green-800 border-green-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

export function TransactionCard({ transaction }: TransactionCardProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { details } = useSelector((state: RootState) => state.userPayment); 

    const handleViewDetailsClick = () => {
        if (transaction.order_id) {
          dispatch(fetchTransactionDetails({ 
            user_id: transaction.user_id, 
            order_id: transaction.order_id 
          }));
        }
    };

    const handleDialogClose = () => {
        dispatch(clearTransactionDetails());
    };
    
    const formatStatus = (status: string) => { return status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())};
    const frontPrice = Number(transaction.cart_price) + Number(transaction.shipping_price);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white/50 backdrop-blur-sm border">
      <div>
        <div className="flex justify-between">
          <div>
            <p className="text-sm px-6 pt-4 text-gray-500 mb-1">Transaction ID</p>
            <p className="font-medium px-6 text-lg">{transaction.transaction_id || "-"}</p>
            <div className="px-6 pb-4">
            <Badge 
            variant="secondary" 
            className={`${statusColors[transaction.order_status]} text-sm px-3 py-1 border mt-2`}
            >
                {formatStatus(transaction.order_status).toUpperCase()}
            </Badge>
            </div>
          </div>
          <div className="flex items-center md:items-start justify-end pr-6 pt-6">
          <Dialog onOpenChange={(open) => !open && handleDialogClose()}>
          <DialogTrigger asChild>
                <Button className="" onClick={handleViewDetailsClick}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-h-[90vh] overflow-auto bg-white text-gray-800">
                {details && (
                  <TransactionDetails
                    items={details.items}
                    payment_reference={details.payment_reference}
                    address={details.address}
                    city_name={details.city_name}
                    shipping_price={details.shipping_price}
                    cart_price={details.cart_price}
                  />
                )}
                {!details && <p>Loading...</p>}
              </DialogContent>
            </Dialog>
        </div>
        </div>
      </div>

      <Separator />

      <div className="p-4 grid gap-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2 rounded-lg bg-gray-50">
          <div className="flex items-center">
            <div className="p-2.5">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Store</p>
              <p className="text-lg font-semibold">{transaction.store_name || "-"}</p>
            </div>
          </div>
          <div className="flex items-center mr-4">
          <div className="p-2.5">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Price</p>
              <p className="text-lg font-semibold">
                {transaction.total_price !== undefined ? `${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(Number(transaction.total_price))}` 
                : new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(Number(frontPrice))}
              </p>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-start p-3 rounded-md bg-gray-50">
            <div className="p-2 rounded-full mt-1">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Shipping Method</p>
              <p className="text-base">{transaction.shipping_method.toUpperCase() || "-"}</p>
            </div>
          </div>
          <div className="flex items-start p-3 rounded-md bg-gray-50">
            <div className="p-2 rounded-full mt-1">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Payment Method</p>
              <p className="text-base">{transaction.payment_method ? formatStatus(transaction.payment_method) : "-"}</p>
            </div>
          </div>
        </div>
          <div className="flex items-center p-3 rounded-md bg-gray-50">
          <div className="p-2">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
              {transaction.transaction_id ? "Transaction Date" : "Order Date"}
              </p>
              <p className="text-base">
                {transaction.payment_date 
                  ? new Date(transaction.payment_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) 
                  : "-"}
              </p>
            </div>
        </div>
      </div>
    </Card>
  );
}
