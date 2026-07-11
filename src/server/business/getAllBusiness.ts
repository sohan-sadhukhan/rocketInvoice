"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

const getAllBusiness = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return null;
  }

  const business = await prisma.business.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return business.map((data) => ({
    id: data.id,
    name: data.name,
  }));
};

export default getAllBusiness;
