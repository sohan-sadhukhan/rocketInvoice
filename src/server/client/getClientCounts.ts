import prisma from "@/lib/database/dbClient";
import { getCurrentBusiness } from "../business/getCurrentBusiness";

const getClientCounts = async () => {
  const businessId = await getCurrentBusiness();
  const clientCounts = await prisma.client.count({
    where: {
      businessId: businessId?.currentBusinessId ?? "",
    },
  });

  return clientCounts;
};

export default getClientCounts;
