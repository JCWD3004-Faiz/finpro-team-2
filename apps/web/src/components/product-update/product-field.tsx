"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ProductFieldProps {
  isLoading: boolean;
  onUpdate: () => void;
  children: React.ReactNode;
}

export function ProductField({ isLoading, onUpdate, children }: ProductFieldProps) {
  return (
    <div className="flex items-center gap-4 mb-3">
      {children}
      <Button onClick={onUpdate} disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Update'
        )}
      </Button>
    </div>
  );
}