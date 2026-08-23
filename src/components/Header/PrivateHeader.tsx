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

type NavSubItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type NavGroup = {
  label: string;
  href?: string;
  subItems?: NavSubItem[];
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
  const isActive = pathname === href;

  return (
    <Link
      href={href as never}
      onClick={onClick}
      className={cn(
        "hover:text-primary flex w-full items-center rounded-md py-2.5 text-sm font-medium transition-colors",
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
              className="w-full max-w-sm p-0">
              <SheetHeader className="border-b px-4 py-5">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav
                className="flex h-full flex-col px-4 py-5"
                aria-label="Mobile dashboard navigation">
                <div className="flex flex-1 flex-col gap-1">
                  {privateNavGroups.map((group) => {
                    const isOpen = openMenu === group.label;

                    return (
                      <div key={group.label}>
                        {group.subItems ?
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu((current) =>
                                  current === group.label ? null : group.label,
                                )
                              }
                              aria-expanded={isOpen}
                              aria-controls={`mobile-menu-${group.label}`}
                              className="text-muted-foreground hover:text-foreground hover:bg-muted flex w-full items-center justify-between rounded-md py-2.5 text-left text-base font-medium transition-colors">
                              <span>{group.label}</span>

                              <ChevronDownIcon
                                className={`size-4 shrink-0 transition-transform duration-200 ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {isOpen && (
                              <div
                                id={`mobile-menu-${group.label}`}
                                className="mt-1 ml-3 flex flex-col gap-1 border-l pl-3">
                                {group.subItems.map((item) =>
                                  item.onClick ?
                                    <button
                                      key={item.label}
                                      type="button"
                                      onClick={() => {
                                        item.onClick?.();
                                        closeMenu();
                                      }}
                                      className="text-muted-foreground hover:text-foreground hover:bg-muted w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors">
                                      {item.label}
                                    </button>
                                  : <NavLink
                                      key={item.label}
                                      href={
                                        item.href ?? group.href ?? "/dashboard"
                                      }
                                      label={item.label}
                                      onClick={closeMenu}
                                      className="text-sm"
                                    />,
                                )}
                              </div>
                            )}
                          </>
                        : <NavLink
                            href={group.href ?? "/dashboard"}
                            label={group.label}
                            onClick={closeMenu}
                            className="text-sm"
                          />
                        }
                      </div>
                    );
                  })}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PrivateHeader;
