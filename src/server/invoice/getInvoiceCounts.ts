import prisma from "@/lib/database/dbClient";
import { getCurrentBusiness } from "../business/getCurrentBusiness";

const getInvoiceCounts = async () => {
  const businessId = await getCurrentBusiness();
  const invoiceCounts = await prisma.invoice.count({
    where: {
      businessId: businessId?.currentBusinessId ?? "",
    },
  });

  return invoiceCounts;
};

export default getInvoiceCounts;
