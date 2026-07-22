"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { InvoiceListItem } from "@/lib/types";
import { headers } from "next/headers";

export const getInvoiceDetails = async (): Promise<InvoiceListItem[]> => {
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
    select: {
      invoiceItems: true,
      clientName: true,
      clientAddress: true,
      clientContactInformation: true,
      paymentMethod: true,
      id: true,
      invoiceDate: true,
      status: true,
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return invoices.map((invoice) => ({
    ...invoice,
    total: invoice.total.toNumber(),
    invoiceItems: invoice.invoiceItems.map((item) => ({
      ...item,
      quantity: item.quantity.toNumber(),
      price: item.price.toNumber(),
      discount: item.discount.toNumber(),
      taxRate: item.taxRate.toNumber(),
      lineTotal: item.lineTotal.toNumber(),
    })),
  }));
};
