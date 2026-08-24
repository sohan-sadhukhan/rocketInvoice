import prisma from "@/lib/database/dbClient";
import { getCurrentBusiness } from "../business/getCurrentBusiness";

const getTaxrateCounts = async () => {
  const businessId = await getCurrentBusiness();
  const taxRateCounts = await prisma.taxRate.count({
    where: {
      businessId: businessId?.currentBusinessId ?? "",
    },
  });

  return taxRateCounts;
};

export default getTaxrateCounts;
