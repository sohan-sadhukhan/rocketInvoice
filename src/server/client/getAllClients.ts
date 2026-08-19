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
};

export const getAllClients = async (): Promise<ClientListItem[]> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/auth/signin");
  }

  const currentBusiness = await getCurrentBusiness();

  const clients = await prisma.client.findMany({
    where: {
      businessId: currentBusiness?.currentBusinessId ?? "",
      deletedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  return clients;
};
