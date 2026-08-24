import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";

const getBusinessCounts = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const businessCounts = await prisma.business.count({
    where: {
      userId: session?.user.id,
    },
  });

  return businessCounts;
};

export default getBusinessCounts;
