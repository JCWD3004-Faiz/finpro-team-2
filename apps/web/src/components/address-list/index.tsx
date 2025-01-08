import { Card, CardContent } from "@/components/ui/card";
import { Address } from "@/utils/userInterface";
import { NewAddressForm } from "@/components/address-form";
import { Button } from "@/components/ui/button";
import { Check, Trash2, MapPin } from "lucide-react";

interface AddressListProps {
  addresses: Address[];
  onAddAddress: (address: string, city_name: string, city_id:number) => void;
  onDeleteAddress: (address_id: number) => void;
  onSetDefault: (address_id: number) => void;
}

export function AddressList({ 
  addresses, 
  onAddAddress, 
  onDeleteAddress, 
  onSetDefault 
}: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-foreground">No addresses yet</h2>
          <p className="max-w-sm text-muted-foreground mb-6">
            Add your first delivery address to start ordering groceries
          </p>
          <div className="w-full max-w-md">
            <NewAddressForm onAdd={onAddAddress} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {addresses.map((address, index) => (
        <div key={address.address_id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
    <Card className={`group transition-all duration-200 hover:shadow-md ${address.is_default ? "border-primary bg-primary/5" : ""}`}>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`p-2 rounded-lg ${address.is_default ? "bg-primary/10" : "bg-secondary"}`}>
          <MapPin className={`h-5 w-5 ${address.is_default ? "text-primary" : "text-muted-foreground"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{address.address}</h3>
            {address.is_default && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                Default
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm truncate">
            {address.city_name}
          </p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!address.is_default && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onSetDefault(address.address_id)}
              title="Set as default"
              className="h-8 w-8"
            >
              <Check className="h-4 w-4" />
            </Button>
          )}
          {!address.is_default && (
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDeleteAddress(address.address_id)}
              title="Delete address"
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
        </div>
      ))}
      {addresses.length < 4 && (
        <div className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${addresses.length * 100}ms` }}>
          <NewAddressForm onAdd={onAddAddress} />
        </div>
      )}
    </div>
  );
}