import prisma from "@/lib/database/dbClient";
import { getCurrentBusiness } from "../business/getCurrentBusiness";

const getProductFamilyCounts = async () => {
  const businessId = await getCurrentBusiness();
  const productFamilyCounts = await prisma.productFamily.count({
    where: {
      businessId: businessId?.currentBusinessId ?? "",
    },
  });

  return productFamilyCounts;
};

export default getProductFamilyCounts;
