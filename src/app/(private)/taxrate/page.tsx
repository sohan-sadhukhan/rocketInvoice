import AllTaxRate from "@/components/TaxRate/AllTaxRate";
import { getTaxRates } from "@/server/taxrate/getTaxRates";

const TaxRatePage = async () => {
  const taxRates = await getTaxRates(null);

  return (
    <section className="space-y-6">
      <AllTaxRate
        taxRates={taxRates.data}
        nextCursor={taxRates.nextCursor}
      />
    </section>
  );
};

export default TaxRatePage;
