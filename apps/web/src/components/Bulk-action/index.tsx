import React from "react";
import { Button } from "@/components/ui/button";

interface BulkActionsProps {
  selectedProducts: { inventory_id: number; product_name: string }[];
  onUpdateStock: () => void;
}
function BulkAction({ selectedProducts, onUpdateStock }: BulkActionsProps) {
  const selectedCount = Object.values(selectedProducts).filter(Boolean).length;
  if (selectedCount === 0) return null;
  return (
    <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
      <span className="text-sm text-muted-foreground">
        {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
      </span>
      <Button size="sm" onClick={onUpdateStock}>
        Create Stock Journal
      </Button>
    </div>
  );
}

export default BulkAction;
