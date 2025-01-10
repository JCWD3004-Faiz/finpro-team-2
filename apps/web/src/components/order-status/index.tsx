import { Package, Truck, Clock, CircleEllipsis } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { key: 'PENDING_PAYMENT', icon: CircleEllipsis, label: 'Pending Payment' },
  { key: 'AWAITING_CONFIRMATION', icon:  Clock, label: 'Awaiting Confirmation' },
  { key: 'PROCESSING', icon: Package, label: 'Processing' },
  { key: 'SENT', icon: Truck, label: 'Sent' }
] as const;

export function OrderStatus({ status }: { status: typeof steps[number]['key'] }) {
  const currentIdx = steps.findIndex(step => step.key === status);

  return (
    <div className="w-full pt-2">
      <div className="relative mb-8">
        <div className="h-1 bg-muted absolute top-4 left-[15%] right-[15%] md:left-0 md:right-0">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ 
              width: `${(currentIdx / (steps.length - 1.23)) * 100}%`
            }}
          />
        </div>        
        <div className="flex justify-between relative px-0 md:px-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            
            return (
              <div 
                key={step.key}
                className={cn(
                  "flex flex-col items-center w-1/4 px-1 md:px-0",
                  (isCompleted || isCurrent) ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mb-2 relative z-10",
                  "transition-colors duration-200",
                  {
                    "bg-primary text-primary-foreground": isCompleted || isCurrent,
                    "bg-muted text-muted-foreground": !isCompleted && !isCurrent
                  }
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] md:text-xs font-medium text-center leading-tight">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
