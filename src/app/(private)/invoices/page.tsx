import AllInvoice from "@/components/Invoice/AllInvoice";
import { getCurrentBusinessDetails } from "@/server/business/getCurrentBusinessDetails";
import { getInvoices } from "@/server/invoice/getInvoices";

const InvoicesPage = async () => {
  const invoices = await getInvoices(null);
  const currentBusiness = await getCurrentBusinessDetails();

  return (
    <section className="space-y-6">
      <AllInvoice
        invoices={invoices.data}
        nextCursor={invoices.nextCursor}
      />
    </section>
  );
};

export default InvoicesPage;
