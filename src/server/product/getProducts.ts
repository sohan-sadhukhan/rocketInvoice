"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export type ProductListItem = {
  id: string;
  name: string;
  description: string | null;
  taxRate: string;
  price: string;
  family: string;
  businessName: string;
  createdAt: Date;
};

export const getProducts = async (): Promise<ProductListItem[]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return [];
  }

  const products = await prisma.product.findMany({
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

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    taxRate: product.taxRate.toString(),
    price: product.price.toString(),
    family: product.family,
    businessName: product.business.name,
    createdAt: product.createdAt,
  }));
};
