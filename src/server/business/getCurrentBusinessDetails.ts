"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export const getCurrentBusinessDetails = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentBusinessId = await prisma.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: {
      currentBusinessId: true,
    },
  });

  if (!currentBusinessId?.currentBusinessId) {
    return;
  }

  const currentBusinessDetails = await prisma.business.findUnique({
    where: {
      id: currentBusinessId?.currentBusinessId,
    },
  });

  return currentBusinessDetails;
};
