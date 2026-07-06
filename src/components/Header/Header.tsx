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
import { usePathname } from "next/navigation";
import { useState } from "react";

const publicNavLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/development", label: "Development" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

const authLinks = [
  { href: "/auth/signin", label: "Sign in" },
  { href: "/auth/signup", label: "Sign up" },
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
  const isActive = pathname === href;

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

const Header = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const closeMenu = () => setOpen(false);

  return (
    <header
      className="bg-background/95 supports-backdrop-filter:bg-background/80 fixed top-0 right-0 left-0 z-50 border-b shadow backdrop-blur"
      aria-label="app-header">
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
          aria-label="Main navigation">
          {publicNavLinks.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
            />
          ))}

          {!session && (
            <>
              {authLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                />
              ))}
            </>
          )}

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
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <nav
                className="flex flex-col gap-4 px-4"
                aria-label="Mobile navigation">
                {publicNavLinks.map((link) => (
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

                {!session &&
                  authLinks.map((link) => (
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
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
