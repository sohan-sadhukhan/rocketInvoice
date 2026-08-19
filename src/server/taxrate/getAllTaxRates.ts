"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentBusiness } from "../business/getCurrentBusiness";

export type TaxRateListItem = {
  id: string;
  name: string;
  percent: string;
  businessName: string;
  createdAt: Date;
};

export const getAllTaxRates = async (): Promise<TaxRateListItem[]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }
  const currentBusiness = await getCurrentBusiness();

  const taxRates = await prisma.taxRate.findMany({
    where: {
      deletedAt: null,
      businessId: currentBusiness?.currentBusinessId ?? "",
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
