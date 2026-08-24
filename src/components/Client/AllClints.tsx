"use client";

import { ClientListItem, getClients } from "@/server/client/getClients";
import { format } from "date-fns";
import { PlusIcon, UsersIcon } from "lucide-react";
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

type AllClientsProps = {
  clients: ClientListItem;
  nextCursor: string | null;
  clientCounts: number;
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
            <Skeleton className="h-4 w-16" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

const AllClints = ({ clients, nextCursor, clientCounts }: AllClientsProps) => {
  const [allClients, setAllClients] = useState(clients);
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
      const result = await getClients(cursor);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAllClients((prev) => [...prev, ...result.data]);

      setCursor(result.nextCursor);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold">Clients</h1>
          <p className="text-muted-foreground">
            Manage your clients and contact details.
          </p>
        </div>

        <Button>
          <Link
            href={"/clients/create" as never}
            className={"flex items-center justify-center gap-2"}>
            <PlusIcon /> Add client
          </Link>
        </Button>
      </div>

      {allClients.length === 0 ?
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="size-5" /> No clients yet
            </CardTitle>
            <CardDescription>
              Create your first client to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Link href={"/clients/create" as never}>
                <PlusIcon /> Create client
              </Link>
            </Button>
          </CardContent>
        </Card>
      : <Card>
          <CardHeader>
            <CardTitle>Your clients</CardTitle>
            <CardDescription>
              {clientCounts} client{clientCounts === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%]">Name</TableHead>
                  <TableHead className="w-[20%]">Address</TableHead>
                  <TableHead className="w-[20%]">Contact</TableHead>
                  <TableHead className="w-[12%]">Gender</TableHead>
                  <TableHead className="w-[14%]">Birthdate</TableHead>
                  <TableHead className="w-[14%]">Created</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {allClients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="truncate font-medium">
                      {c.name}
                    </TableCell>

                    <TableCell className="truncate">{c.address}</TableCell>

                    <TableCell className="truncate">
                      {c.contactInformation}
                    </TableCell>

                    <TableCell className="truncate">
                      {c.gender ?? "-"}
                    </TableCell>

                    <TableCell>
                      {c.birthdate ? format(c.birthdate, "dd MMM yyyy") : "-"}
                    </TableCell>

                    <TableCell>{format(c.createdAt, "dd MMM yyyy")}</TableCell>
                  </TableRow>
                ))}

                {loading && <TableSkeletonRows count={4} />}
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
              : "No more clients"}
            </div>
          </CardFooter>
        </Card>
      }
    </>
  );
};

export default AllClints;
