"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const getInvoiceWithItem = async (id: string) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/auth/signin");
  }

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      invoiceDate: true,
      status: true,
      paymentMethod: true,
      clientName: true,
      clientAddress: true,
      clientContactInformation: true,
      total: true,
      createdAt: true,
      invoiceItems: true,
    },
  });

  if (!invoice) {
    return null;
  }

  return {
    ...invoice,
    total: Number(invoice.total),
    invoiceItems: invoice.invoiceItems.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
      price: Number(item.price),
      discount: Number(item.discount),
      taxRate: Number(item.taxRate),
      lineTotal: Number(item.lineTotal),
    })),
  };
};

export default getInvoiceWithItem;
