import React from 'react';
import { ExternalLink, FileCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { PaymentProof } from '@/utils/paymentProofTypes';

interface PaymentProofSectionProps {
  proof?: PaymentProof;
}

export function PaymentProofSection({ proof }: PaymentProofSectionProps) {
  if (!proof?.pop_image) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center text-muted-foreground">
        No proof of payment uploaded
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-lg border bg-muted">
        <img
          src={proof.pop_image}
          alt="Payment proof"
          className="object-cover"
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileCheck className="h-4 w-4" />
          <span>Uploaded on {new Date(proof?.created_at).toLocaleDateString()}</span>
        </div>
        <a href={proof.pop_image} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            View Full Image
          </Button>
        </a>
      </div>
    </div>
  );
}