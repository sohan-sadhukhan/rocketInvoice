import AllInvoice from "@/components/Invoice/AllInvoice";
import getInvoiceCounts from "@/server/invoice/getInvoiceCounts";
import { getInvoices } from "@/server/invoice/getInvoices";

const InvoicesPage = async () => {
  const [invoices, invoiceCounts] = await Promise.all([
    getInvoices(null),
    getInvoiceCounts(),
  ]);
  return (
    <section className="space-y-6">
      <AllInvoice
        invoices={invoices.data}
        nextCursor={invoices.nextCursor}
        invoiceCounts={invoiceCounts}
      />
    </section>
  );
};

export default InvoicesPage;
