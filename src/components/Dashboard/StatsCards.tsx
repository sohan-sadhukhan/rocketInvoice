import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import getRevenueStats from "@/server/business/getRevenueStats";
import getCustomerGrowth from "@/server/client/getCustomerGrowth";
import { ArrowUpRight, UsersIcon } from "lucide-react";
import getMonthlyInvoices from "../../server/invoice/getMonthlyInvoices";

const StatsCards = async () => {
  const [customersNumber, revenueGrowth, monthlyInvoices] = await Promise.all([
    getCustomerGrowth(),
    getRevenueStats(),
    getMonthlyInvoices(),
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm font-medium">New customers</CardTitle>
            <CardDescription>
              +{customersNumber.customerPercent}% vs last month
            </CardDescription>
          </div>
          <div className="bg-primary/10 text-primary rounded-2xl p-2">
            <UsersIcon className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold">{customersNumber.customer}</p>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <ArrowUpRight className="size-4" />
              <span>Stable</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm font-medium">Total revenue</CardTitle>
            <CardDescription>
              +{Number(revenueGrowth.revenueGrowthPercentage)}% vs last month
            </CardDescription>
          </div>
          <div className="bg-primary/10 text-primary rounded-2xl p-2">
            <UsersIcon className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold">
              {Number(revenueGrowth.revenue)}
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <ArrowUpRight className="size-4" />
              <span>Stable</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <CardDescription>
              +{Number(monthlyInvoices.growthPercent)}% vs last month
            </CardDescription>
          </div>
          <div className="bg-primary/10 text-primary rounded-2xl p-2">
            <UsersIcon className="size-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-semibold">
              {Number(monthlyInvoices.totalInvoices)}
            </p>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <ArrowUpRight className="size-4" />
              <span>Stable</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
