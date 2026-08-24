import AllBusiness from "@/components/Business/AllBusiness";
import getBusinessCounts from "@/server/business/getBusinessCounts";
import { getBusinesses } from "@/server/business/getBusinesses";
import { getCurrentBusiness } from "@/server/business/getCurrentBusiness";

const BusinessPage = async () => {
  const [businesses, currentBusiness, businessCounts] = await Promise.all([
    getBusinesses(null),
    getCurrentBusiness(),
    getBusinessCounts(),
  ]);
  return (
    <section className="space-y-6">
      <AllBusiness
        businesses={businesses.data}
        nextCursor={businesses.nextCursor}
        currentBusinessId={currentBusiness?.currentBusinessId}
        businessCounts={businessCounts}
      />
    </section>
  );
};

export default BusinessPage;
