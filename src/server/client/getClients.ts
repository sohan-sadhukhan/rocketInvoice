"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export type ClientListItem = {
  id: string;
  name: string;
  address: string;
  contactInformation: string;
  gender?: string | null;
  birthdate?: Date | null;
  createdAt: Date;
};

export const getClients = async (): Promise<ClientListItem[]> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  const clients = await prisma.client.findMany({
    where: { business: { userId: session.user.id }, deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return clients.map((c) => ({
    id: c.id,
    name: c.name,
    address: c.address,
    contactInformation: c.contactInformation,
    gender: c.gender,
    birthdate: c.birthdate ?? null,
    createdAt: c.createdAt,
  }));
};
