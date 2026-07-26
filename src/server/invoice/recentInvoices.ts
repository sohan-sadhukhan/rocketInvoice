"use server";

import prisma from "@/lib/database/dbClient";

const recentInvoices = async (currentBusinessId: string) => {
  const thisMonthInvoices = await prisma.invoice.findMany({
    where: {
      businessId: currentBusinessId,
    },
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
