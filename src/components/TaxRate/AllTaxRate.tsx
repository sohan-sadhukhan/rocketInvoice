"use client";

import { getTaxRates } from "@/server/taxrate/getTaxRates";
import { format } from "date-fns";
import { PercentIcon, PlusIcon } from "lucide-react";
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

type AllTaxRateProp = {
  taxRates: {
    id: string;
    name: string;
    percent: string;
    createdAt: Date;
  }[];
  nextCursor: string | null;
  taxRateCounts: number;
};

const TableSkeletonRows = ({ count = 4 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton className="h-4 w-48 sm:w-64 md:w-72" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-12" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

const AllTaxRate = ({
  taxRates,
  nextCursor,
  taxRateCounts,
}: AllTaxRateProp) => {
  const [alltaxRates, setAlltaxRates] = useState(taxRates);
  const [cursor, setCursor] = useState(nextCursor);
  const [loading, setLoading] = useState(false);
  const { ref } = useInView({
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
      const result = await getTaxRates(cursor);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAlltaxRates((prev) => [...prev, ...result.data]);

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
          <h1 className="font-heading text-3xl font-semibold">Tax rates</h1>
          <p className="text-muted-foreground">
            View and manage the tax rates available for your invoices.
          </p>
        </div>

        <Button>
          <Link
            href={"/taxrate/create" as never}
            className="flex items-center justify-center gap-2">
            <PlusIcon />
            Add tax rate
          </Link>
        </Button>
      </div>
      {taxRateCounts === 0 ?
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PercentIcon className="size-5" />
              No tax rates yet
            </CardTitle>
            <CardDescription>
              Create a business first, then add tax rates you can reuse.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Link href={"/taxrate/create" as never}>
                <PlusIcon />
                Create tax rate
              </Link>
            </Button>
          </CardContent>
        </Card>
      : <Card>
          <CardHeader>
            <CardTitle>Your tax rates</CardTitle>
            <CardDescription>
              {taxRateCounts} tax rate{taxRateCounts === 1 ? "" : "s"} saved
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Name</TableHead>
                  <TableHead className="w-[20%]">Percent</TableHead>
                  <TableHead className="w-[30%]">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alltaxRates.map((taxRate) => (
                  <TableRow key={taxRate.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{taxRate.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{taxRate.percent}%</Badge>
                    </TableCell>
                    <TableCell>
                      {format(taxRate.createdAt, "dd MMM yyyy")}
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
              : "No more tax rates"}
            </div>
          </CardFooter>
        </Card>
      }
    </>
  );
};

export default AllTaxRate;
