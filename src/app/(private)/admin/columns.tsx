"use client";

import { Button } from "@/components/shadcnui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcnui/dropdown-menu";
import banUser from "@/server/admin/banUser";
import { deleteUser } from "@/server/admin/deleteUser";
import { getUserBusinesses } from "@/server/admin/getUserBusinesses";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowUpDownIcon,
  Ban,
  Eye,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean | null;
  banReason: string | null;
  banExpires: Date | null;
  createdAt: Date;
  _count: {
    businesses: number;
  };
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "_count.businesses",
    header: "Businesses",
    cell: ({ row }) => {
      const count = row.original._count.businesses;
      return <div className="">{count}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <div className="inline-flex items-center rounded-full px-1 py-1 text-sm font-medium">
          {role === "ADMIN" ?
            <span className="text-blue-700">Admin</span>
          : <span className="text-gray-600">User</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => {
      const isBanned = row.original.banned;
      return (
        <div>
          {isBanned ?
            <span className="font-medium text-red-600">Banned</span>
          : <span className="font-medium text-green-600">Active</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "MMM dd, yyyy");
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      return <UserActionsMenu user={user} />;
    },
  },
];

const UserActionsMenu = ({ user }: { user: User }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(false);
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);

  const handleBan = async () => {
    const { message, success } = await banUser(user.id);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    const { message, success } = await deleteUser(user.id);
    if (success) {
      toast.success(message);
      setIsDialogOpen(false);
    } else {
      toast.error(message);
    }
  };

  const handleViewBusinesses = async () => {
    setIsLoadingBusinesses(true);
    try {
      const data = await getUserBusinesses(user.id);
      setBusinesses(data);
      setShowBusinessDialog(true);
    } catch (error) {
      toast.error("Failed to load businesses");
    } finally {
      setIsLoadingBusinesses(false);
    }
  };

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-6 w-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleViewBusinesses}
                disabled={user._count.businesses === 0}>
                <Eye className="mr-2 h-4 w-4" />
                View Businesses
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleBan}
                className="cursor-pointer text-orange-600">
                <Ban className="mr-2 h-4 w-4" />
                {user.banned ? "Unban User" : "Ban User"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDialogOpen(true)}
                className="cursor-pointer text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {user.name} This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showBusinessDialog}
        onOpenChange={setShowBusinessDialog}>
        <DialogContent className="max-h-96 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Businesses for {user.name}</DialogTitle>
            <DialogDescription>
              Total: {businesses.length} business(es)
            </DialogDescription>
          </DialogHeader>
          {isLoadingBusinesses ?
            <div className="py-4 text-center">Loading...</div>
          : businesses.length > 0 ?
            <div className="space-y-4">
              {businesses.map((business) => (
                <div
                  key={business.id}
                  className="rounded-lg border p-4">
                  <h3 className="font-semibold">{business.name}</h3>
                  <p className="text-sm text-gray-600">{business.address}</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">
                        {business._count.invoices}
                      </span>
                      <p className="text-gray-600">Invoices</p>
                    </div>
                    <div>
                      <span className="font-medium">
                        {business._count.clients}
                      </span>
                      <p className="text-gray-600">Clients</p>
                    </div>
                    <div>
                      <span className="font-medium">
                        {business._count.products}
                      </span>
                      <p className="text-gray-600">Products</p>
                    </div>
                  </div>
                  {business.deletedAt && (
                    <p className="mt-2 text-xs text-red-600">
                      Deleted on{" "}
                      {format(new Date(business.deletedAt), "MMM dd, yyyy")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          : <div className="py-4 text-center text-gray-600">
              No businesses found
            </div>
          }
        </DialogContent>
      </Dialog>
    </>
  );
};
