"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentBusiness } from "../business/getCurrentBusiness";

export type TaxRateListItem = {
  data: {
    id: string;
    name: string;
    percent: string;
    createdAt: Date;
  }[];
  nextCursor: string | null;
};

export const getTaxRates = async (
  cursor: string | null,
): Promise<TaxRateListItem> => {
  const limit = 10;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }
  const currentBusiness = await getCurrentBusiness();

  const taxRates = await prisma.taxRate.findMany({
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: {
        id: cursor,
      },
    }),
    where: {
      deletedAt: null,
      businessId: currentBusiness?.currentBusinessId ?? "",
    },
    orderBy: { id: "desc" },
  });

  const hasNextPage = taxRates.length > limit;

  const paginatedItems = hasNextPage ? taxRates.slice(0, limit) : taxRates;

  const nextCursor =
    hasNextPage ? paginatedItems[paginatedItems.length - 1].id : null;

  const cleanData = paginatedItems.map((taxRate) => ({
    id: taxRate.id,
    name: taxRate.name,
    percent: taxRate.percent.toString(),
    createdAt: taxRate.createdAt,
  }));

  return {
    data: cleanData,
    nextCursor,
  };
};
