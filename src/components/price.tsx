import type { Money } from "@/lib/shopify/types";
import { formatMoney } from "@/lib/utils";

type PriceProps = {
  amount: Money;
  compareAt?: Money;
  className?: string;
};

export function Price({ amount, compareAt, className = "" }: PriceProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-medium text-foreground">{formatMoney(amount)}</span>
      {compareAt && parseFloat(compareAt.amount) > parseFloat(amount.amount) && (
        <span className="text-sm text-muted line-through">
          {formatMoney(compareAt)}
        </span>
      )}
    </div>
  );
}
