import InvoiceOverview from "@/components/Dashboard/InvoiceOverview";
import QuickActions from "@/components/Dashboard/QuickActions";
import RecentInvoices from "@/components/Dashboard/RecentInvoices";
import StatsCards from "@/components/Dashboard/StatsCards";

const DashboardPage = async () => {
  return (
    <section className="space-y-6">
      <QuickActions />
      <StatsCards />

      <div className="grid gap-6 xl:grid-cols-2">
        <InvoiceOverview />
        <RecentInvoices />
      </div>
    </section>
  );
};

export default DashboardPage;
