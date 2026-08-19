"use client";

import { getProductFamilies } from "@/server/product/getProductFamilies";
import { BoxesIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
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

type ProductFamilyListProp = {
  families: {
    id: string;
    name: string;
  }[];
  nextCursor: string | null;
};

const TableSkeletonRows = ({ count = 4 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

const ProductFamilyList = ({ families, nextCursor }: ProductFamilyListProp) => {
  const [allProductFamilies, setAllProductFamilies] = useState(families);
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
      const result = await getProductFamilies(cursor);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAllProductFamilies((prev) => [...prev, ...result.data]);

      setCursor(result.nextCursor);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold">
            Product families
          </h1>
          <p className="text-muted-foreground">
            Manage the reusable groups used to organize your products.
          </p>
        </div>

        <Button>
          <Link
            href={"/products/family/create" as never}
            className={"flex items-center justify-center gap-2"}>
            <PlusIcon /> Create family
          </Link>
        </Button>
      </div>

      {allProductFamilies.length === 0 ?
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BoxesIcon className="size-5" /> No families yet
            </CardTitle>
            <CardDescription>
              Create your first product family to organize your catalog.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Link href={"/products/family/create" as never}>
                <PlusIcon /> Create family
              </Link>
            </Button>
          </CardContent>
        </Card>
      : <Card>
          <CardHeader>
            <CardTitle>Your product families</CardTitle>
            <CardDescription>
              {allProductFamilies.length} family
              {allProductFamilies.length === 1 ? "" : "ies"} in your catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allProductFamilies.map((family) => (
                  <TableRow key={family.id}>
                    <TableCell className="text-primary/80 font-medium">
                      {family.name}
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
              : "No more product families"}
            </div>
          </CardFooter>
        </Card>
      }
    </>
  );
};

export default ProductFamilyList;
