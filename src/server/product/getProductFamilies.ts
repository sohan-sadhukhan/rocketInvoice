"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentBusiness } from "../business/getCurrentBusiness";

export type ProductFamilyOption = {
  data: {
    id: string;
    name: string;
  }[];
  nextCursor: string | null;
};

export const getProductFamilies = async (
  myCursor: string | null,
): Promise<ProductFamilyOption> => {
  const limit = 15;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  const currentBusiness = await getCurrentBusiness();

  const families = await prisma.productFamily.findMany({
    take: limit + 1,
    ...(myCursor && {
      skip: 1,
      cursor: {
        id: myCursor,
      },
    }),
    where: {
      deletedAt: null,
      businessId: currentBusiness?.currentBusinessId ?? "",
    },
    orderBy: { id: "desc" },
    select: {
      id: true,
      name: true,
    },
  });

  const hasNextPage = families.length > limit;

  const paginatedItems = hasNextPage ? families.slice(0, limit) : families;

  const nextCursor =
    hasNextPage ? paginatedItems[paginatedItems.length - 1].id : null;

  return {
    data: paginatedItems,
    nextCursor,
  };
};
