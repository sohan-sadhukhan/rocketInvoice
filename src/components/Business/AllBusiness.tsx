"use client";

import { getBusinesses } from "@/server/business/getBusinesses";
import { updateCurrentBusiness } from "@/server/business/updateCurrentBusiness";
import { format } from "date-fns";
import { Building2Icon, CheckIcon, PlusIcon } from "lucide-react";
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

type Business = {
  id: string;
  name: string;
  address: string;
  contactInformation: string;
  createdAt: Date;
  productCount: number;
};

type AllBusinessProp = {
  businesses: Business[];
  nextCursor: string | null;
  currentBusinessId: string | null | undefined;
  businessCounts: number;
};

const TableSkeletonRows = ({ count = 4 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-6 w-8 rounded-full" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-8 w-28" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

const AllBusiness = ({
  businesses,
  nextCursor,
  currentBusinessId: initialCurrentBusinessId,
  businessCounts,
}: AllBusinessProp) => {
  const [allbusinesses, setAllbusinesses] = useState(businesses);
  const [cursor, setCursor] = useState(nextCursor);
  const [currentBusinessId, setCurrentBusinessId] = useState(
    initialCurrentBusinessId,
  );
  const [switchingBusinessId, setSwitchingBusinessId] = useState<string | null>(
    null,
  );
  const [error, setError] = useState<string | undefined>(undefined);
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
    if (!cursor || loading) return;

    setLoading(true);

    try {
      const result = await getBusinesses(cursor);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAllbusinesses((prev) => [...prev, ...result.data]);
      setCursor(result.nextCursor);
    } finally {
      setLoading(false);
    }
  };

  const handleSetCurrentBusiness = async (businessId: string) => {
    if (businessId === currentBusinessId) {
      return;
    }

    setError(undefined);
    setSwitchingBusinessId(businessId);

    try {
      const result = await updateCurrentBusiness(businessId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setCurrentBusinessId(result.data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSwitchingBusinessId(null);
    }
  };

  const currentBusiness = allbusinesses.find(
    (business) => business.id === currentBusinessId,
  );

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold">Business</h1>

          <p className="text-muted-foreground">
            Manage your business profiles and contact details.
          </p>
        </div>

        <Button>
          <Link href="/business/create">
            <PlusIcon />
            Add business
          </Link>
        </Button>
      </div>

      {error && (
        <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {businessCounts === 0 ?
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2Icon className="size-5" />
              No businesses yet
            </CardTitle>

            <CardDescription>
              Create your first business to start adding products and invoices.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button>
              <Link href="/business/create">
                <PlusIcon />
                Create business
              </Link>
            </Button>
          </CardContent>
        </Card>
      : <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Your businesses</CardTitle>

                <CardDescription>
                  {businessCounts} business
                  {businessCounts === 1 ? "" : "es"} registered
                </CardDescription>
              </div>

              {currentBusiness ?
                <Badge
                  variant="secondary"
                  className="w-fit gap-1.5 px-3 py-1">
                  <CheckIcon className="size-3.5" />
                  Current: {currentBusiness.name}
                </Badge>
              : <Badge
                  variant="outline"
                  className="w-fit">
                  No current business
                </Badge>
              }
            </div>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Name</TableHead>
                  <TableHead className="w-[25%]">Address</TableHead>
                  <TableHead className="w-[20%]">Contact</TableHead>
                  <TableHead className="w-[10%]">Products</TableHead>
                  <TableHead className="w-[15%]">Created</TableHead>
                  <TableHead className="w-[10%] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {allbusinesses.map((business) => {
                  const isCurrent = business.id === currentBusinessId;

                  const isSwitching = switchingBusinessId === business.id;

                  return (
                    <TableRow
                      key={business.id}
                      className={isCurrent ? "bg-muted/40" : undefined}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {business.name}

                          {isCurrent && (
                            <Badge
                              variant="default"
                              className="gap-1 text-xs">
                              <CheckIcon className="size-3" />
                              Current
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="max-w-xs truncate">
                        {business.address}
                      </TableCell>

                      <TableCell className="max-w-xs truncate">
                        {business.contactInformation}
                      </TableCell>

                      <TableCell>
                        <Badge variant="secondary">
                          {business.productCount}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {format(business.createdAt, "dd MMM yyyy")}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant={isCurrent ? "secondary" : "outline"}
                          disabled={isCurrent}
                          onClick={() => handleSetCurrentBusiness(business.id)}>
                          {isSwitching ?
                            "Switching..."
                          : isCurrent ?
                            <>
                              <CheckIcon />
                              Current
                            </>
                          : "Set current"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

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
              : "No more businesses"}
            </div>
          </CardFooter>
        </Card>
      }
    </>
  );
};

export default AllBusiness;
