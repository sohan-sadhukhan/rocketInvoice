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
import { getProducts } from "@/server/product/getProducts";
import { format } from "date-fns";
import { PackageIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

const ProductsPage = async () => {
  const products = await getProducts();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold">Products</h1>
          <p className="text-muted-foreground">
            View and manage products across your businesses.
          </p>
        </div>

        <Button>
          <Link href={"/products/create" as never}>
            <PlusIcon />
            Add product
          </Link>
        </Button>
      </div>

      {products.length === 0 ?
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackageIcon className="size-5" />
              No products yet
            </CardTitle>
            <CardDescription>
              Create a business first, then add products to your catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>
              <Link href={"/business/create" as never}>Create business</Link>
            </Button>

            <Button>
              {" "}
              <Link href={"/products/create" as never}>
                <PlusIcon />
                Create product
              </Link>
            </Button>
          </CardContent>
        </Card>
      : <Card>
          <CardHeader>
            <CardTitle>Your products</CardTitle>
            <CardDescription>
              {products.length} product{products.length === 1 ? "" : "s"} in
              catalog
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Family</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tax rate</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{product.name}</p>
                        {product.description && (
                          <p className="text-muted-foreground max-w-xs truncate text-xs">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.family}</Badge>
                    </TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.taxRate}%</TableCell>
                    <TableCell>{product.businessName}</TableCell>
                    <TableCell>
                      {format(product.createdAt, "dd MMM yyyy")}
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

export default ProductsPage;
