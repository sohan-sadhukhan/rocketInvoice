import prisma from "@/lib/database/dbClient";
import { getCurrentBusiness } from "../business/getCurrentBusiness";

const getProductCounts = async () => {
  const businessId = await getCurrentBusiness();
  const productCounts = await prisma.product.count({
    where: {
      businessId: businessId?.currentBusinessId ?? "",
    },
  });

  return productCounts;
};

export default getProductCounts;
