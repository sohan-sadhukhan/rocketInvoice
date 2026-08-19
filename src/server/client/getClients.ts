"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentBusiness } from "../business/getCurrentBusiness";

export type ClientListItem = {
  id: string;
  name: string;
  address: string;
  contactInformation: string;
  gender?: string | null;
  birthdate?: Date | null;
  createdAt: Date;
}[];

type ApiResponse<T> = {
  data: T;
  nextCursor: string | null;
};

export const getClients = async (
  myCursor: string | null,
): Promise<ApiResponse<ClientListItem>> => {
  const limit = 15;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/auth/signin");
  }

  const currentBusiness = await getCurrentBusiness();

  if (!currentBusiness?.currentBusinessId) {
    redirect("/business/create");
  }

  const clients = await prisma.client.findMany({
    take: limit + 1,
    ...(myCursor && {
      skip: 1,
      cursor: {
        id: myCursor,
      },
    }),
    where: {
      businessId: currentBusiness.currentBusinessId ?? "",
      deletedAt: null,
    },
    orderBy: { id: "desc" },
  });

  const hasNextPage = clients.length > limit;

  const paginatedItems = hasNextPage ? clients.slice(0, limit) : clients;

  const nextCursor =
    hasNextPage ? paginatedItems[paginatedItems.length - 1].id : null;

  const cleanData = paginatedItems.map((c) => ({
    id: c.id,
    name: c.name,
    address: c.address,
    contactInformation: c.contactInformation,
    gender: c.gender,
    birthdate: c.birthdate ?? null,
    createdAt: c.createdAt,
  }));

  return {
    data: cleanData,
    nextCursor,
  };
};
