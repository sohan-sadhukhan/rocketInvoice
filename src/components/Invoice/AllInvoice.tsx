"use client";

import { getInvoices } from "@/server/invoice/getInvoices";
import { format } from "date-fns";
import { PlusIcon, ReceiptText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Badge } from "../shadcnui/badge";
import { Button } from "../shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcnui/card";
import { Skeleton } from "../shadcnui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcnui/table";
import { InvoicePdf } from "./InvoicePdf";

type AllInvoiceProp = {
  invoices: {
    id: string;
    invoiceDate: Date;
    status: string;
    paymentMethod: string;
    clientName: string;
    total: string;
    createdAt: Date;
  }[];
  nextCursor: string | null;
  invoiceCounts: number;
};

const TableSkeletonRows = ({ count = 4 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <TableRow key={index}>
          <TableCell className="w-[14%]">
            <Skeleton className="h-4 w-24" />
          </TableCell>

          <TableCell className="w-[12%]">
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>

          <TableCell className="w-[14%]">
            <Skeleton className="h-4 w-20" />
          </TableCell>

          <TableCell className="w-[18%]">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </TableCell>

          <TableCell className="w-[12%]">
            <Skeleton className="h-4 w-20" />
          </TableCell>

          <TableCell className="w-[14%]">
            <Skeleton className="h-4 w-24" />
          </TableCell>

          <TableCell className="w-[16%]">
            <Skeleton className="h-8 w-24" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

const AllInvoice = ({
  invoices,
  nextCursor,
  invoiceCounts,
}: AllInvoiceProp) => {
  const [allinvoices, setAllinvoices] = useState(invoices);
  const [cursor, setCursor] = useState(nextCursor);
  const [loading, setLoading] = useState(false);
  const { ref, inView, entry } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView) {
        loadMore();
      }
    },
  });

  const loadMore = async () => {
    if (!cursor) return;

    if (loading) return;

    setLoading(true);

    try {
      const result = await getInvoices(cursor);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAllinvoices((prev) => [...prev, ...result.data]);

      setCursor(result.nextCursor);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {" "}
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
      {invoiceCounts === 0 ?
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
              {invoiceCounts} invoice{invoiceCounts === 1 ? "" : "s"} created.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[14%]">Invoice date</TableHead>
                  <TableHead className="w-[12%]">Status</TableHead>
                  <TableHead className="w-[14%]">Payment</TableHead>
                  <TableHead className="w-[18%]">Client</TableHead>
                  <TableHead className="w-[12%]">Total</TableHead>
                  <TableHead className="w-[14%]">Created</TableHead>
                  <TableHead className="w-[16%]">Invoice PDF</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allinvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      {format(invoice.invoiceDate, "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{invoice.total.toString()}</TableCell>
                    <TableCell>
                      {format(invoice.createdAt, "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <InvoicePdf id={invoice.id} />
                    </TableCell>
                  </TableRow>
                ))}
                {loading && <TableSkeletonRows />}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter
            className="justify-center border-t py-6"
            ref={ref}>
            <div className="text-muted-foreground text-sm">
              {loading ?
                "Loading records..."
              : cursor ?
                "Scroll for more..."
              : "No more invoices"}
            </div>
          </CardFooter>
        </Card>
      }
    </>
  );
};

export default AllInvoice;
