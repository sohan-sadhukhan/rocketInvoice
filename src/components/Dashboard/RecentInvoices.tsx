import { Badge } from "@/components/shadcnui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnui/table";
import recentInvoices from "@/server/invoice/recentInvoices";
import { format } from "date-fns";

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-500/10 text-emerald-600",
  sent: "bg-sky-500/10 text-sky-600",
  draft: "bg-amber-500/10 text-amber-600",
  cancelled: "bg-rose-500/10 text-rose-600",
};

const RecentInvoices = async () => {
  const invoices = await recentInvoices();

  return (
    <div className="bg-card/70 ring-foreground/5 dark:ring-foreground/10 rounded-4xl border p-6 shadow-sm ring-1">
      <div className="mb-6">
        <h2 className="font-heading text-xl font-semibold">Recent invoices</h2>
        <p className="text-muted-foreground text-sm">
          A quick view of your latest billing activity.
        </p>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {invoices.map((invoice, index) => (
          <div
            key={index}
            className="bg-background/40 rounded-2xl border p-4">
            <div className="mb-3 flex items-center justify-between">
              <Badge className={statusStyles[invoice.status]}>
                {invoice.status}
              </Badge>

              <span className="font-semibold">{invoice.ammount}</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Client</span>
                <span className="font-medium">{invoice.clientName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{format(invoice.createdAt, "dd MMM yyyy")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {invoices.map((invoice, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge className={statusStyles[invoice.status]}>
                    {invoice.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  {format(invoice.createdAt, "dd MMM yyyy")}
                </TableCell>

                <TableCell>{invoice.clientName}</TableCell>

                <TableCell className="text-right font-medium">
                  {invoice.ammount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentInvoices;
