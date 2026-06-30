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
import { getBusinesses } from "@/server/business/getBusinesses";
import { format } from "date-fns";
import { Building2Icon, PlusIcon } from "lucide-react";
import Link from "next/link";

const BusinessPage = async () => {
  const businesses = await getBusinesses();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold">Business</h1>
          <p className="text-muted-foreground">
            Manage your business profiles and contact details.
          </p>
        </div>

        <Button>
          <Link href={"/business/create" as never}>
            <PlusIcon />
            Add business
          </Link>
        </Button>
      </div>

      {businesses.length === 0 ?
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2Icon className="size-5" />
              No businesses yet
            </CardTitle>
            <CardDescription>
              Create your first business to start adding products and invoices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Link href={"/business/create" as never}>
                <PlusIcon />
                Create business
              </Link>
            </Button>
          </CardContent>
        </Card>
      : <Card>
          <CardHeader>
            <CardTitle>Your businesses</CardTitle>
            <CardDescription>
              {businesses.length} business
              {businesses.length === 1 ? "" : "es"} registered
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">
                      {business.name}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {business.address}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {business.contactInformation}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{business.productCount}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(business.createdAt, "dd MMM yyyy")}
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

export default BusinessPage;
