import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import getMonthlyInvoicesStatus from "@/server/invoice/getMonthlyInvoicesStatus";

type InvoiceOverviewProp = {
  currentBusinessId: string;
};

const InvoiceOverview = async ({ currentBusinessId }: InvoiceOverviewProp) => {
  const allInvoices = await getMonthlyInvoicesStatus(currentBusinessId);
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Invoice overview</CardTitle>
            <CardDescription>Monthly invoice totals by status.</CardDescription>
          </div>
          <div className="py-1 text-xs font-medium md:text-sm">This Month</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {allInvoices.map((row, ind) => (
            <div
              key={ind}
              className="bg-background/70 flex items-center justify-between rounded-2xl border px-4 py-3">
              <span className="font-medium">{row.status.toUpperCase()}</span>
              <span className="text-muted-foreground text-sm">
                ₹{row.amount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceOverview;
