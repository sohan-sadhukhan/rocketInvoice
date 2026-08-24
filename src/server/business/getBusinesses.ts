"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentBusiness } from "./getCurrentBusiness";

export type BusinessListItem = {
  data: {
    id: string;
    name: string;
    address: string;
    contactInformation: string;
    createdAt: Date;
    productCount: number;
  }[];
  nextCursor: string | null;
};

export const getBusinesses = async (
  cursor: string | null,
): Promise<BusinessListItem> => {
  const limit = 15;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  const currentBusiness = await getCurrentBusiness();

  const businesses = await prisma.business.findMany({
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: {
        id: cursor,
      },
    }),
    where: {
      userId: session.user.id,
      deletedAt: null,
    },
    orderBy: { id: "desc" },
    include: {
      _count: {
        select: { products: { where: { deletedAt: null } } },
      },
    },
  });

  const hasNextPage = businesses.length > limit;

  const paginatedItems = hasNextPage ? businesses.slice(0, limit) : businesses;

  const nextCursor =
    hasNextPage ? paginatedItems[paginatedItems.length - 1].id : null;

  const cleanData = paginatedItems.map((business) => ({
    id: business.id,
    name: business.name,
    address: business.address,
    contactInformation: business.contactInformation,
    createdAt: business.createdAt,
    productCount: business._count.products,
  }));

  return {
    data: cleanData,
    nextCursor,
  };
};
