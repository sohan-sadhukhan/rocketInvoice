"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentBusiness } from "../business/getCurrentBusiness";

type InvoiceLis = {
  data: {
    id: string;
    invoiceDate: Date;
    status: string;
    paymentMethod: string;
    clientName: string;
    total: string;
    createdAt: Date;
  }[];
  nextCursor: string | null;
};

export const getInvoices = async (
  cursor: string | null,
): Promise<InvoiceLis> => {
  const limit = 15;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/auth/signin");
  }

  const currentBusiness = await getCurrentBusiness();

  const invoices = await prisma.invoice.findMany({
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: {
        id: cursor,
      },
    }),
    where: {
      deletedAt: null,
      businessId: currentBusiness?.currentBusinessId ?? "",
    },
    select: {
      id: true,
      invoiceDate: true,
      status: true,
      paymentMethod: true,
      clientName: true,
      total: true,
      createdAt: true,
    },
    orderBy: { id: "desc" },
  });

  const hasNextPage = invoices.length > limit;

  const paginatedItems = hasNextPage ? invoices.slice(0, limit) : invoices;

  const nextCursor =
    hasNextPage ? paginatedItems[paginatedItems.length - 1].id : null;

  const cleanData = paginatedItems.map((invoice) => ({
    id: invoice.id,
    invoiceDate: invoice.invoiceDate,
    status: invoice.status,
    paymentMethod: invoice.paymentMethod,
    clientName: invoice.clientName,
    total: invoice.total.toString(),
    createdAt: invoice.createdAt,
  }));

  return {
    data: cleanData,
    nextCursor,
  };
};
