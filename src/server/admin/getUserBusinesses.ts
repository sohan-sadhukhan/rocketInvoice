"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export const getUserBusinesses = async (userId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const businesses = await prisma.business.findMany({
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
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  return businesses;
};
