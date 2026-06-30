"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export type BusinessListItem = {
  id: string;
  name: string;
  address: string;
  contactInformation: string;
  createdAt: Date;
  productCount: number;
};

export const getBusinesses = async (): Promise<BusinessListItem[]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  const businesses = await prisma.business.findMany({
    where: {
      userId: session.user.id,
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { products: { where: { deletedAt: null } } },
      },
    },
  });

  return businesses.map((business) => ({
    id: business.id,
    name: business.name,
    address: business.address,
    contactInformation: business.contactInformation,
    createdAt: business.createdAt,
    productCount: business._count.products,
  }));
};
