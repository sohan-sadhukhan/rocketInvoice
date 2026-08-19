"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export const getUserBusinesses = async (
  userId: string,
  myCursor: string | null,
) => {
  const limit = 15;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const businesses = await prisma.business.findMany({
    take: limit + 1,
    ...(myCursor && {
      skip: 1,
      cursor: {
        id: myCursor,
      },
    }),
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      address: true,
      contactInformation: true,
      deletedAt: true,
      createdAt: true,
      _count: {
        select: {
          invoices: true,
          clients: true,
          products: true,
        },
      },
    },
    orderBy: { id: "desc" },
  });

  const hasNextPage = businesses.length > limit;

  const paginatedItems = hasNextPage ? businesses.slice(0, limit) : businesses;

  const nextCursor =
    hasNextPage ? paginatedItems[paginatedItems.length - 1].id : null;

  return {
    data: paginatedItems,
    nextCursor,
  };
};
