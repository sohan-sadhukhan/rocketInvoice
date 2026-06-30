"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export type InvoiceListItem = {
  id: string;
  invoiceDate: Date;
  status: string;
  paymentMethod: string;
  clientName: string;
  total: string;
  createdAt: Date;
};

export const getInvoices = async (): Promise<InvoiceListItem[]> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const invoices = await prisma.invoice.findMany({
    where: {
      business: {
        userId: session.user.id,
        deletedAt: null,
      },
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  return invoices.map((invoice) => ({
    id: invoice.id,
    invoiceDate: invoice.invoiceDate,
    status: invoice.status,
    paymentMethod: invoice.paymentMethod,
    clientName: invoice.clientName,
    total: invoice.total.toString(),
    createdAt: invoice.createdAt,
  }));
};
