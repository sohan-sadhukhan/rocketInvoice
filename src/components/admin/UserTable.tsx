"use client";

import { getAllUsers } from "@/server/admin/getAllUsers";
import { format } from "date-fns";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
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
import UserActionsMenu from "./UserActionsMenu";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean | null;
  createdAt: Date;
  _count: {
    businesses: number;
  };
};

type UsersTableProps = {
  users: User[];
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

          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>

          <TableCell>
            <Skeleton className="h-8 w-8" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export function UsersTable({ users, nextCursor }: UsersTableProps) {
  const [allUsers, setAllUsers] = useState(users);
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
    if (!cursor || loading) return;

    setLoading(true);

    try {
      const result = await getAllUsers(cursor);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAllUsers((prev) => [...prev, ...result.data]);

      setCursor(result.nextCursor);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (userId: string, banned: boolean) => {
    setAllUsers((prev) =>
      prev.map((user) =>
        user.id === userId ?
          {
            ...user,
            banned,
          }
        : user,
      ),
    );
  };

  const handleDelete = (userId: string) => {
    setAllUsers((prev) => prev.filter((user) => user.id != userId));
  };

  return (
    <>
      {allUsers.length === 0 ?
        <Card>
          <CardHeader>
            <CardTitle>No users yet</CardTitle>

            <CardDescription>There are no users to display.</CardDescription>
          </CardHeader>
        </Card>
      : <Card>
          <CardHeader>
            <CardTitle>All users</CardTitle>

            <CardDescription>
              {allUsers.length} user
              {allUsers.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>

          <CardContent className="overflow-x-auto">
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[18%]">Name</TableHead>

                  <TableHead className="w-[25%]">Email</TableHead>

                  <TableHead className="w-[12%]">Businesses</TableHead>

                  <TableHead className="w-[12%]">Role</TableHead>

                  <TableHead className="w-[12%]">Status</TableHead>

                  <TableHead className="w-[14%]">Created</TableHead>

                  <TableHead className="w-[7%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="truncate font-medium">
                      {user.name}
                    </TableCell>

                    <TableCell className="truncate">{user.email}</TableCell>

                    <TableCell>{user._count.businesses}</TableCell>

                    <TableCell>
                      {user.role === "ADMIN" ?
                        <span className="font-medium text-blue-700">Admin</span>
                      : <span>User</span>}
                    </TableCell>

                    <TableCell>
                      {user.banned ?
                        <span className="font-medium text-red-600">Banned</span>
                      : <span className="font-medium text-green-600">
                          Active
                        </span>
                      }
                    </TableCell>

                    <TableCell>
                      {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </TableCell>

                    <TableCell className="text-right">
                      <UserActionsMenu
                        _count={user._count}
                        banned={user.banned}
                        id={user.id}
                        name={user.name}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    </TableCell>
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
              : "No more users"}
            </div>
          </CardFooter>
        </Card>
      }
    </>
  );
}
