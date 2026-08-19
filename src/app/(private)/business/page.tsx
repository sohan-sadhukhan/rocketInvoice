import AllBusiness from "@/components/Business/AllBusiness";
import { getBusinesses } from "@/server/business/getBusinesses";
import { getCurrentBusiness } from "@/server/business/getCurrentBusiness";

const BusinessPage = async () => {
  const businesses = await getBusinesses(null);
  const currentBusinessId = await getCurrentBusiness();

  return (
    <section className="space-y-6">
      <AllBusiness
        businesses={businesses.data}
        nextCursor={businesses.nextCursor}
        currentBusinessId={currentBusinessId?.currentBusinessId}
      />
    </section>
  );
};

export default BusinessPage;
