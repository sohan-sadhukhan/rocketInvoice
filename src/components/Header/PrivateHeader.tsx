"use client";

import ThemeToggleButton from "@/components/Buttons/ThemeToggleButton";
import { Button } from "@/components/shadcnui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcnui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import BusinessSwitcher from "../Business/BusinessSwitcher";

type NavSubItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type NavGroup = {
  label: string;
  href?: string;
  subItems?: NavSubItem[];
  content?: React.ReactNode;
};

const NavLink = ({
  href,
  label,
  onClick,
  className,
}: {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href as never}
      onClick={onClick}
      className={cn(
        "hover:text-primary text-sm font-medium transition-colors",
        isActive ? "text-primary" : "text-muted-foreground",
        className,
      )}>
      {label}
    </Link>
  );
};

const PrivateHeader = () => {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const router = useRouter();

  const closeMenu = () => {
    setOpen(false);
    setOpenMenu(null);
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.push("/" as never);
        },
      },
    });
    closeMenu();
  };

  const privateNavGroups: NavGroup[] = [
    { label: "Dashboard", href: "/dashboard" },
    {
      label: "Clients",
      href: "/clients",
      subItems: [
        { label: "View clients", href: "/clients" },
        { label: "Create clients", href: "/clients/create" },
      ],
    },
    {
      label: "Invoices",
      href: "/invoices",
      subItems: [
        { label: "View invoices", href: "/invoices" },
        { label: "Create invoices", href: "/invoices/create" },
      ],
    },
    {
      label: "Products",
      href: "/products",
      subItems: [
        { label: "View products", href: "/products" },
        { label: "Create products", href: "/products/create" },
        { label: "View product families", href: "/products/family" },
        { label: "Create product families", href: "/products/family/create" },
      ],
    },
    {
      label: "Settings",
      href: "/settings",
      content: <BusinessSwitcher />,
      subItems: [
        { label: "View tax rate", href: "/taxrate" },
        { label: "Create tax rate", href: "/taxrate/create" },
        { label: "View business", href: "/business" },
        { label: "Create business", href: "/business/create" },
        { label: "Personal information", href: "/settings" },
        {
          label: "Sign out",
          onClick: () => {
            void handleSignOut();
          },
        },
      ],
    },
  ];

  return (
    <header
      className="bg-background/95 supports-backdrop-filter:bg-background/80 fixed top-0 right-0 left-0 z-50 border-b shadow backdrop-blur"
      aria-label="dashboard-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link
          href={"/" as never}
          className="shrink-0">
          <span className="font-heading text-xl font-semibold sm:text-2xl">
            RocketInvoice
          </span>
        </Link>

        <nav
          className="hidden items-center gap-5 lg:flex"
          aria-label="Dashboard navigation">
          {privateNavGroups.map((group) => (
            <div
              key={group.label}
              className="relative">
              {group.subItems ?
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu((current) =>
                        current === group.label ? null : group.label,
                      )
                    }
                    className="hover:text-primary text-muted-foreground text-sm font-medium transition-colors">
                    <span className="flex items-center gap-1">
                      {group.label}
                      <ChevronDownIcon className="size-4" />
                    </span>
                  </button>

                  {openMenu === group.label && (
                    <div className="bg-background absolute top-full left-0 mt-2 min-w-56 rounded-lg border p-2 shadow-lg">
                      {group.content && (
                        <div className="mb-2 border-b pb-3">
                          {group.content}
                        </div>
                      )}
                      {group.subItems.map((item) =>
                        item.onClick ?
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                              item.onClick?.();
                              closeMenu();
                            }}
                            className="hover:bg-muted hover:text-primary text-muted-foreground block w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors">
                            {item.label}
                          </button>
                        : <NavLink
                            key={item.label}
                            href={item.href ?? group.href ?? "/dashboard"}
                            label={item.label}
                            onClick={closeMenu}
                            className="hover:bg-muted block rounded-md px-3 py-2"
                          />,
                      )}
                    </div>
                  )}
                </>
              : <NavLink
                  href={group.href ?? "/dashboard"}
                  label={group.label}
                />
              }
            </div>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}>
            Sign out
          </Button>

          <ThemeToggleButton />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggleButton />

          <Sheet
            open={open}
            onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="Open menu">
                  <MenuIcon />
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="w-full max-w-xs">
              <SheetHeader>
                <SheetTitle>Dashboard</SheetTitle>
              </SheetHeader>

              <nav
                className="flex flex-col gap-4 px-4"
                aria-label="Mobile dashboard navigation">
                {privateNavGroups.map((group) => (
                  <div
                    key={group.label}
                    className="space-y-2">
                    {group.subItems ?
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu((current) =>
                              current === group.label ? null : group.label,
                            )
                          }
                          className="hover:text-primary text-muted-foreground flex items-center gap-1 text-base font-medium transition-colors">
                          {group.label}
                          <ChevronDownIcon className="size-4" />
                        </button>

                        {openMenu === group.label && (
                          <div className="ml-4 flex flex-col gap-2">
                            {group.content && (
                              <div className="mb-3 border-b pb-3">
                                {group.content}
                              </div>
                            )}
                            {group.subItems.map((item) =>
                              item.onClick ?
                                <button
                                  key={item.label}
                                  type="button"
                                  onClick={() => {
                                    item.onClick?.();
                                    closeMenu();
                                  }}
                                  className="hover:text-primary text-muted-foreground text-left text-sm font-medium transition-colors">
                                  {item.label}
                                </button>
                              : <NavLink
                                  key={item.label}
                                  href={item.href ?? group.href ?? "/dashboard"}
                                  label={item.label}
                                  onClick={closeMenu}
                                  className="text-base"
                                />,
                            )}
                          </div>
                        )}
                      </>
                    : <NavLink
                        href={group.href ?? "/dashboard"}
                        label={group.label}
                        onClick={closeMenu}
                        className="text-base"
                      />
                    }
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSignOut}>
                  Sign out
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PrivateHeader;
