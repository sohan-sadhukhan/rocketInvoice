"use server";

import prisma from "@/lib/database/dbClient";

const recentInvoices = async () => {
  const thisMonthInvoices = await prisma.invoice.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return thisMonthInvoices.map((invoice) => ({
    status: invoice.status,
    ammount: Number(invoice.total),
    createdAt: invoice.createdAt,
    clientName: invoice.clientName,
  }));
};

export default recentInvoices;
