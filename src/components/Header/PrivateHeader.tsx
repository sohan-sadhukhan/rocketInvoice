"use client";

import ThemeToggleButton from "@/components/Buttons/ThemeToggleButton";
import { Button } from "@/components/shadcnui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/shadcnui/sheet";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const privateNavLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/invoices", label: "Invoices" },
  { href: "/business", label: "Business" },
  { href: "/products", label: "Products" },
  { href: "/products/family/create", label: "Families" },
  { href: "/taxrate", label: "Tax Rate" },
  { href: "/settings", label: "Settings" },
] as const;

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
  const router = useRouter();

  const closeMenu = () => setOpen(false);

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

  return (
    <header
      className="bg-background/95 supports-backdrop-filter:bg-background/80 fixed top-0 right-0 left-0 z-50 border-b shadow backdrop-blur"
      aria-label="dashboard-header">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link
          href={"/dashboard" as never}
          className="shrink-0">
          <span className="font-heading text-xl font-semibold sm:text-2xl">
            RocketInvoice
          </span>
        </Link>

        <nav
          className="hidden items-center gap-5 lg:flex"
          aria-label="Dashboard navigation">
          {privateNavLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
            />
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
                {privateNavLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <NavLink
                        href={link.href}
                        label={link.label}
                        onClick={closeMenu}
                        className="text-base"
                      />
                    }
                  />
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
