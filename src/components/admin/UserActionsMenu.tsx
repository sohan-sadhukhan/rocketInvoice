import banUser from "@/server/admin/banUser";
import { deleteUser } from "@/server/admin/deleteUser";
import { getUserBusinesses } from "@/server/admin/getUserBusinesses";
import { format } from "date-fns";
import { BanIcon, EyeIcon, Settings2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "react-toastify";
import { Button } from "../shadcnui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../shadcnui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcnui/dropdown-menu";
import { BusinessSkeletonList } from "./BusinessSkeletonList";

type UserActionsMenuProp = {
  id: string;
  name: string;
  banned: boolean | null;
  _count: {
    businesses: number;
  };
  onStatusChange: (userId: string, banned: boolean) => void;
  onDelete: (userId: string) => void;
};

const UserActionsMenu = ({
  _count,
  banned,
  id,
  name,
  onStatusChange,
  onDelete,
}: UserActionsMenuProp) => {
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [businesses, setBusinesses] = useState<
    {
      _count: {
        products: number;
        clients: number;
        invoices: number;
      };
      id: string;
      name: string;
      address: string;
      contactInformation: string;
      deletedAt: Date | null;
      createdAt: Date;
    }[]
  >([]);
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(false);
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);
  const { ref } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView) {
        loadMore();
      }
    },
  });

  const handleBan = async () => {
    const { message, success } = await banUser(id);

    if (success) {
      toast.success(message);
      onStatusChange(id, !banned);
    } else {
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    const { message, success } = await deleteUser(id);

    if (success) {
      toast.success(message);
      setIsDialogOpen(false);
      onDelete(id);
    } else {
      toast.error(message);
    }
  };

  const loadMore = async () => {
    if (!cursor) return;

    if (loading) return;

    setLoading(true);

    try {
      const result = await getUserBusinesses(id, cursor);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBusinesses((prev) => [...prev, ...result.data]);

      setCursor(result.nextCursor);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBusinesses = async () => {
    setIsLoadingBusinesses(true);
    try {
      const data = await getUserBusinesses(id, cursor);

      setBusinesses(data.data);
      setCursor(data.nextCursor);
      setShowBusinessDialog(true);
    } catch {
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

            <Settings2Icon className="h-5 w-5" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={handleViewBusinesses}
                disabled={_count.businesses === 0}>
                <EyeIcon className="mr-2 h-4 w-4" />
                View Businesses
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleBan}
                className="cursor-pointer text-orange-600">
                <BanIcon className="mr-2 h-4 w-4" />

                {banned ? "Unban User" : "Ban User"}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setIsDialogOpen(true)}
                className="cursor-pointer text-red-600">
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>

            <DialogDescription className="text-wrap">
              Are you sure you want to delete <strong>{name}</strong> ? This
              action cannot be undone.
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
        <DialogContent className="flex h-[80vh] max-h-[700px] w-[95vw] max-w-4xl flex-col gap-0 p-0">
          {/* Fixed Header */}
          <DialogHeader className="shrink-0 border-b px-6 py-5">
            <DialogTitle className="text-xl">Businesses for {name}</DialogTitle>

            <DialogDescription>
              Total: {businesses.length} business(es)
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {/* Initial Loading */}
            {isLoadingBusinesses && businesses.length === 0 ?
              <BusinessSkeletonList count={4} />
            : businesses.length > 0 ?
              <div className="space-y-4">
                {businesses.map((business) => (
                  <div
                    key={business.id}
                    className="bg-card rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-semibold">
                          {business.name}
                        </h3>

                        {business.address && (
                          <p className="text-muted-foreground mt-1 text-sm">
                            {business.address}
                          </p>
                        )}
                      </div>

                      {business.deletedAt && (
                        <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                          Deleted
                        </span>
                      )}
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <span className="block text-lg font-semibold">
                          {business._count.invoices}
                        </span>

                        <span className="text-muted-foreground text-xs">
                          Invoices
                        </span>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <span className="block text-lg font-semibold">
                          {business._count.clients}
                        </span>

                        <span className="text-muted-foreground text-xs">
                          Clients
                        </span>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <span className="block text-lg font-semibold">
                          {business._count.products}
                        </span>

                        <span className="text-muted-foreground text-xs">
                          Products
                        </span>
                      </div>
                    </div>

                    {business.deletedAt && (
                      <p className="mt-4 border-t pt-3 text-xs text-red-600">
                        Deleted on{" "}
                        {format(new Date(business.deletedAt), "MMM dd, yyyy")}
                      </p>
                    )}
                  </div>
                ))}

                {/* Loading More */}
                {loading && <BusinessSkeletonList count={2} />}

                {/* Infinite Scroll Trigger */}
                {cursor && !loading && (
                  <div
                    ref={ref}
                    className="h-4"
                  />
                )}

                {!cursor && (
                  <div className="py-4 text-center">
                    <span className="text-muted-foreground text-xs">
                      No more businesses
                    </span>
                  </div>
                )}
              </div>
            : <div className="flex min-h-40 items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  No businesses found
                </p>
              </div>
            }
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserActionsMenu;
