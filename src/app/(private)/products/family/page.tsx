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
import { getProductFamilies } from "@/server/product/getProductFamilies";
import { BoxesIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

const ProductFamiliesPage = async () => {
  const families = await getProductFamilies();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold">
            Product families
          </h1>
          <p className="text-muted-foreground">
            Manage the reusable groups used to organize your products.
          </p>
        </div>

        <Button>
          <Link
            href={"/products/family/create" as never}
            className={"flex items-center justify-center gap-2"}>
            <PlusIcon /> Create family
          </Link>
        </Button>
      </div>

      {families.length === 0 ?
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BoxesIcon className="size-5" /> No families yet
            </CardTitle>
            <CardDescription>
              Create your first product family to organize your catalog.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Link href={"/products/family/create" as never}>
                <PlusIcon /> Create family
              </Link>
            </Button>
          </CardContent>
        </Card>
      : <Card>
          <CardHeader>
            <CardTitle>Your product families</CardTitle>
            <CardDescription>
              {families.length} family{families.length === 1 ? "" : "ies"} in
              your catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {families.map((family) => (
                  <TableRow key={family.id}>
                    <TableCell className="text-primary/80 font-medium">
                      {family.name}
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

export default ProductFamiliesPage;
