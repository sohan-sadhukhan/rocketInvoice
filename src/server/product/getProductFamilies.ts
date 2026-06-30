"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export type ProductFamilyOption = {
  id: string;
  name: string;
};

export const getProductFamilies = async (): Promise<ProductFamilyOption[]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  const families = await prisma.productFamily.findMany({
    where: {
      deletedAt: null,
      business: {
        userId: session.user.id,
        deletedAt: null,
      },
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  return families;
};
