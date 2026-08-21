"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentBusiness } from "../business/getCurrentBusiness";

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

export const getAllProducts = async (): Promise<ProductListItem[]> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  const currentBusiness = await getCurrentBusiness();

  const products = await prisma.product.findMany({
    where: {
      deletedAt: null,
      businessId: currentBusiness?.currentBusinessId ?? "",
    },
    include: {
      business: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    taxRate: product.taxRate ? product.taxRate.toString() : "",
    price: product.price.toString(),
    family: product.family,
    businessName: product.business.name,
    createdAt: product.createdAt,
  }));
};
