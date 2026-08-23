"use client";

import { getProducts, ProductListItem } from "@/server/product/getProducts";
import { format } from "date-fns";
import { PackageIcon, PlusIcon } from "lucide-react";
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

type AllProductsProp = {
  products: ProductListItem[];
  nextCursor: string | null;
};

const TableSkeletonRows = ({ count = 4 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-4 w-52" />
            </div>
          </TableCell>

          <TableCell>
            <Skeleton className="h-6 w-20 rounded-full" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-16" />
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
const AllProducts = ({ products, nextCursor }: AllProductsProp) => {
  const [allproducts, setAllproducts] = useState(products);
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
      const result = await getProducts(cursor);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAllproducts((prev) => [...prev, ...result.data]);

      setCursor(result.nextCursor);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold">Products</h1>
          <p className="text-muted-foreground">
            View and manage products across your businesses.
          </p>
        </div>

        <Button>
          <Link
            href={"/products/create"}
            className={"flex items-center justify-center gap-2"}>
            <PlusIcon />
            Add product
          </Link>
        </Button>
      </div>

      {allproducts.length === 0 ?
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageIcon className="size-5" />
              No products yet
            </CardTitle>
            <CardDescription>
              Create a business first, then add products to your catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>
              <Link href={"/business/create"}>Create business</Link>
            </Button>

            <Button>
              {" "}
              <Link href={"/products/create"}>
                <PlusIcon />
                Create product
              </Link>
            </Button>
          </CardContent>
        </Card>
      : <Card>
          <CardHeader>
            <CardTitle>Your products</CardTitle>
            <CardDescription>
              {allproducts.length} product{allproducts.length === 1 ? "" : "s"}{" "}
              in catalog
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Name</TableHead>
                  <TableHead className="w-[20%]">Family</TableHead>
                  <TableHead className="w-[10%]">Price</TableHead>
                  <TableHead className="w-[10%]">Tax rate</TableHead>
                  <TableHead className="w-[20%]">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allproducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{product.name}</p>
                        {product.description && (
                          <p className="text-muted-foreground max-w-xs truncate text-xs">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.family}</Badge>
                    </TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.taxRate}%</TableCell>
                    <TableCell>
                      {format(product.createdAt, "dd MMM yyyy")}
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
              : "No more products"}
            </div>
          </CardFooter>
        </Card>
      }
    </>
  );
};

export default AllProducts;
