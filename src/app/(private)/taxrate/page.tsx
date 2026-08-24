import AllTaxRate from "@/components/TaxRate/AllTaxRate";
import getTaxrateCounts from "@/server/taxrate/getTaxrateCounts";
import { getTaxRates } from "@/server/taxrate/getTaxRates";

const TaxRatePage = async () => {
  const [taxRates, taxRateCounts] = await Promise.all([
    getTaxRates(null),
    getTaxrateCounts(),
  ]);
  return (
    <section className="space-y-6">
      <AllTaxRate
        taxRates={taxRates.data}
        nextCursor={taxRates.nextCursor}
        taxRateCounts={taxRateCounts}
      />
    </section>
  );
};

export default TaxRatePage;
