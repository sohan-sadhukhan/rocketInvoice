import { Badge } from "@/components/shadcnui/badge";
import { Button } from "@/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcnui/table";
import { getTaxRates } from "@/server/taxrate/getTaxRates";
import { format } from "date-fns";
import { PercentIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

const TaxRatePage = async () => {
  const taxRates = await getTaxRates();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold">Tax rates</h1>
          <p className="text-muted-foreground">
            View and manage the tax rates available for your invoices.
          </p>
        </div>

        <Button>
          <Link
            href={"/taxrate/create" as never}
            className="flex items-center justify-center gap-2">
            <PlusIcon />
            Add tax rate
          </Link>
        </Button>
      </div>

      {taxRates.length === 0 ?
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PercentIcon className="size-5" />
              No tax rates yet
            </CardTitle>
            <CardDescription>
              Create a business first, then add tax rates you can reuse.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Link href={"/taxrate/create" as never}>
                <PlusIcon />
                Create tax rate
              </Link>
            </Button>
          </CardContent>
        </Card>
      : <Card>
          <CardHeader>
            <CardTitle>Your tax rates</CardTitle>
            <CardDescription>
              {taxRates.length} tax rate{taxRates.length === 1 ? "" : "s"} saved
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Percent</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxRates.map((taxRate) => (
                  <TableRow key={taxRate.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{taxRate.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{taxRate.percent}%</Badge>
                    </TableCell>
                    <TableCell>{taxRate.businessName}</TableCell>
                    <TableCell>
                      {format(taxRate.createdAt, "dd MMM yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      }
    </section>
  );
};

export default TaxRatePage;
