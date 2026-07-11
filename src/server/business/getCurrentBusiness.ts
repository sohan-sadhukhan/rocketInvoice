"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

export const getCurrentBusiness = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentBusiness = await prisma.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: {
      currentBusinessId: true,
    },
  });
  return currentBusiness;
};
