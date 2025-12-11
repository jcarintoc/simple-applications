import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BanknoteArrowDown, Sparkle, Brackets } from "lucide-react";

interface ExpenseStatsProps {
  totalAmount: number;
  filteredAmount: number;
  totalCount: number;
}

export function ExpenseStats({
  totalAmount,
  filteredAmount,
  totalCount,
}: ExpenseStatsProps) {
  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription className="inline-flex gap-2 items-center">
            <BanknoteArrowDown className="size-4"/>
            Total Expenses
          </CardDescription>
          <CardTitle className="font-mono text-3xl tabular-nums">
            ${totalAmount.toFixed(2)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="inline-flex gap-2 items-center">
            <Sparkle className="size-4"/>
            Filtered Total
          </CardDescription>
          <CardTitle className="font-mono text-3xl tabular-nums">
            ${filteredAmount.toFixed(2)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription className="inline-flex gap-2 items-center">
            <Brackets className="size-4"/>
            Tracked Items
          </CardDescription>
          <CardTitle className="font-mono text-3xl tabular-nums">
            {totalCount}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
