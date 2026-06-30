"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export type TaxRateListItem = {
  id: string;
  name: string;
  percent: string;
  businessName: string;
  createdAt: Date;
};

export const getTaxRates = async (): Promise<TaxRateListItem[]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  const taxRates = await prisma.taxRate.findMany({
    where: {
      deletedAt: null,
      business: {
        userId: session.user.id,
        deletedAt: null,
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      business: {
        select: { name: true },
      },
    },
  });

  return taxRates.map((taxRate) => ({
    id: taxRate.id,
    name: taxRate.name,
    percent: taxRate.percent.toString(),
    businessName: taxRate.business.name,
    createdAt: taxRate.createdAt,
  }));
};
