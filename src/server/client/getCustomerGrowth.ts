"use server";

import prisma from "@/lib/database/dbClient";

const getCustomerGrowth = async (currentBusinessId: string) => {
  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const thisMonthCustomers = await prisma.client.count({
    where: {
      businessId: currentBusinessId,
      createdAt: {
        gte: startOfMonth,
        lt: endOfMonth,
      },
    },
  });

  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const lastMonthCustomers = await prisma.client.count({
    where: {
      businessId: currentBusinessId,
      createdAt: {
        gte: startOfLastMonth,
        lt: endOfLastMonth,
      },
    },
  });

  const growth =
    lastMonthCustomers === 0 ? 100 : (
      ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
    );

  const growthPercent = Number(growth.toFixed(1));

  return { customer: thisMonthCustomers, customerPercent: growthPercent };
};

export default getCustomerGrowth;
