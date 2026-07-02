import { Badge } from "@/components/shadcnui/badge";
import { Button } from "@/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnui/table";
import { getInvoices } from "@/server/invoice/getInvoices";
import { format } from "date-fns";
import { PlusIcon, ReceiptText } from "lucide-react";
import Link from "next/link";

const InvoicesPage = async () => {
  const invoices = await getInvoices();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold">Invoices</h1>
          <p className="text-muted-foreground">
            Track invoices for your businesses and create new billing records.
          </p>
        </div>

        <Button>
          <Link
            href={"/invoices/create" as never}
            className={"flex items-center justify-center gap-2"}>
            <PlusIcon /> Add invoice
          </Link>
        </Button>
      </div>

      {invoices.length === 0 ?
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="size-5" /> No invoices yet
            </CardTitle>
            <CardDescription>
              Create your first invoice to start tracking sales and payments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Link href={"/invoices/create" as never}>
                <PlusIcon /> Create invoice
              </Link>
            </Button>
          </CardContent>
        </Card>
      : <Card>
          <CardHeader>
            <CardTitle>Your invoices</CardTitle>
            <CardDescription>
              {invoices.length} invoice{invoices.length === 1 ? "" : "s"}{" "}
              created.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {format(invoice.invoiceDate, "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{invoice.total}</TableCell>
                    <TableCell>
                      {format(invoice.createdAt, "dd MMM yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      }
    </section>
  );
};

export default InvoicesPage;
