"use client";

import { ArrowUpRightIcon, RocketIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-lg font-semibold">
              <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
                <RocketIcon className="size-4" />
              </span>

              <span>RocketInvoice</span>
            </Link>

            <p className="text-muted-foreground mt-4 max-w-md text-sm leading-6">
              Simple, fast, and professional invoicing for freelancers,
              consultants, and growing businesses.
            </p>

            <nav
              aria-label="Social links"
              className="mt-6">
              <ul className="flex items-center gap-2">
                <li>
                  <Link
                    href="https://github.com/sohan-sadhukhan/rocketInvoice"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="RocketInvoice on GitHub"
                    className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-md border transition-colors">
                    <Image
                      src="/github.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="size-4 dark:invert"
                    />
                  </Link>
                </li>

                <li>
                  <Link
                    href="https://sohansadhukhan.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Sohan Sadhukhan portfolio"
                    className="bg-background text-muted-foreground hover:bg-muted hover:text-foreground inline-flex size-9 items-center justify-center rounded-md border transition-colors">
                    <ArrowUpRightIcon className="size-4" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <nav aria-label="Product">
            <h2 className="text-sm font-semibold">Product</h2>

            <ul className="text-muted-foreground mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  href="/invoices"
                  className="hover:text-foreground transition-colors">
                  Invoices
                </Link>
              </li>

              <li>
                <Link
                  href="/clients"
                  className="hover:text-foreground transition-colors">
                  Clients
                </Link>
              </li>

              <li>
                <Link
                  href="/business"
                  className="hover:text-foreground transition-colors">
                  Business
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h2 className="text-sm font-semibold">Resources</h2>

            <ul className="text-muted-foreground mt-4 space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors">
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="https://github.com/sohan-sadhukhan/rocketInvoice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground inline-flex items-center gap-1 transition-colors">
                  GitHub
                  <ArrowUpRightIcon className="size-3" />
                </Link>
              </li>

              <li>
                <Link
                  href="https://sohansadhukhan.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground inline-flex items-center gap-1 transition-colors">
                  Developer
                  <ArrowUpRightIcon className="size-3" />
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t pt-6 sm:mt-12 sm:pt-8">
          <div className="text-muted-foreground flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} RocketInvoice. All rights reserved.
            </p>

            <nav aria-label="Legal">
              <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-end">
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-foreground transition-colors">
                    Privacy
                  </a>
                </li>

                <li>
                  <a
                    href="/terms"
                    className="hover:text-foreground transition-colors">
                    Terms
                  </a>
                </li>

                <li aria-hidden="true">
                  <span className="bg-border hidden h-4 w-px sm:block" />
                </li>

                <li>
                  <Link
                    href="https://github.com/sohan-sadhukhan/rocketInvoice/blob/main/LICENSE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors">
                    MIT License
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <p className="text-muted-foreground mt-5 text-center text-xs">
            Built with Next.js, React, TypeScript, Prisma &amp; Better Auth
            <span className="block sm:inline">
              {" "}
              by{" "}
              <Link
                href="https://sohansadhukhan.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground font-medium hover:underline">
                Sohan Sadhukhan
              </Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
