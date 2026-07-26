import InvoiceOverview from "@/components/Dashboard/InvoiceOverview";
import QuickActions from "@/components/Dashboard/QuickActions";
import RecentInvoices from "@/components/Dashboard/RecentInvoices";
import StatsCards from "@/components/Dashboard/StatsCards";
import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  const userInfo = await prisma.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: {
      currentBusinessId: true,
    },
  });

  if (!userInfo) {
    redirect("/auth/signin");
  }
  return (
    <section className="space-y-6">
      <QuickActions />
      <StatsCards currentBusinessId={userInfo.currentBusinessId ?? ""} />

      <div className="grid gap-6 xl:grid-cols-2">
        <InvoiceOverview currentBusinessId={userInfo.currentBusinessId ?? ""} />
        <RecentInvoices currentBusinessId={userInfo.currentBusinessId ?? ""} />
      </div>
    </section>
  );
};

export default DashboardPage;
