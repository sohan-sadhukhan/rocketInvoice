"use server";

import prisma from "@/lib/database/dbClient";

const getMonthlyInvoices = async (currentBusinessId: string) => {
  const now = new Date();

  const startofMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endofMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const thisMonthInvoice = await prisma.invoice.count({
    where: {
      businessId: currentBusinessId,
      createdAt: {
        gte: startofMonth,
        lt: endofMonth,
      },
    },
  });

  const startoLastfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endofLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const lastMonthInvoice = await prisma.invoice.count({
    where: {
      businessId: currentBusinessId,
      createdAt: {
        gte: startoLastfMonth,
        lt: endofLastMonth,
      },
    },
  });

  let growthPercent = 0;

  if (lastMonthInvoice === 0) {
    growthPercent = thisMonthInvoice > 0 ? 100 : 0;
  } else {
    growthPercent =
      ((thisMonthInvoice - lastMonthInvoice) / lastMonthInvoice) * 100;
  }

  return {
    totalInvoices: thisMonthInvoice,
    growthPercent: Number(growthPercent.toFixed(1)),
  };
};

export default getMonthlyInvoices;
