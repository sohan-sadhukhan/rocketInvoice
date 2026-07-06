"use server";

import prisma from "@/lib/database/dbClient";

const getRevenueStats = async () => {
  const now = new Date();

  const startofMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endofMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const thisMonthRevenueResult = await prisma.invoice.aggregate({
    where: {
      status: "paid",
      createdAt: {
        gte: startofMonth,
        lt: endofMonth,
      },
    },
    _sum: {
      total: true,
    },
  });

  const currentRevenue = Number(thisMonthRevenueResult._sum.total ?? 0);

  const startoLastfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endofLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const lastMonthRevenueResult = await prisma.invoice.aggregate({
    where: {
      status: "paid",
      createdAt: {
        gte: startoLastfMonth,
        lt: endofLastMonth,
      },
    },
    _sum: {
      total: true,
    },
  });

  const previousRevenue = Number(lastMonthRevenueResult._sum.total ?? 0);

  const revenueGrowthPercentage =
    previousRevenue === 0 ? 100 : (
      ((currentRevenue - previousRevenue) / previousRevenue) * 100
    );

  return {
    revenue: currentRevenue,
    revenueGrowthPercentage: revenueGrowthPercentage.toFixed(1),
  };
};

export default getRevenueStats;
