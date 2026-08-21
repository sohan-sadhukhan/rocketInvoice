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

type ApiResponse<T> = {
  data: T;
  nextCursor: string | null;
};

export const getProducts = async (
  cursor: string | null,
): Promise<ApiResponse<ProductListItem[]>> => {
  const limit = 10;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  const currentBusiness = await getCurrentBusiness();

  const products = await prisma.product.findMany({
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
    include: {
      business: {
        select: { name: true },
      },
    },
    orderBy: { id: "desc" },
  });

  const hasNextPage = products.length > limit;

  const paginatedItems = hasNextPage ? products.slice(0, limit) : products;

  const nextCursor =
    hasNextPage ? paginatedItems[paginatedItems.length - 1].id : null;

  const cleanData = paginatedItems.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    taxRate: product.taxRate ? product.taxRate.toString() : "",
    price: product.price.toString(),
    family: product.family,
    businessName: product.business.name,
    createdAt: product.createdAt,
  }));

  return {
    data: cleanData,
    nextCursor,
  };
};
