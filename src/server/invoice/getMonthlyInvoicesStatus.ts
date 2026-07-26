"use server";

import prisma from "@/lib/database/dbClient";

const getMonthlyInvoicesStatus = async (currentBusinessId: string) => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const result = await prisma.invoice.groupBy({
    by: ["status"],
    where: {
      businessId: currentBusinessId,
      createdAt: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
    _sum: {
      total: true,
    },
  });

  const statuses = ["draft", "sent", "paid", "cancelled"];

  return statuses.map((status) => {
    const item = result.find((r) => r.status === status);

    return {
      status,
      amount: Number(item?._sum.total ?? 0),
    };
  });
};

export default getMonthlyInvoicesStatus;
