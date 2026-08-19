"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentBusiness } from "../business/getCurrentBusiness";

type ProductFamilyOption = {
  id: string;
  name: string;
};

export const getAllProductFamilies = async (): Promise<
  ProductFamilyOption[]
> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  const currentBusiness = await getCurrentBusiness();

  const families = await prisma.productFamily.findMany({
    where: {
      deletedAt: null,
      businessId: currentBusiness?.currentBusinessId ?? "",
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
    },
  });

  return families;
};
