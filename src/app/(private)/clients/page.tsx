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
import { getClients } from "@/server/client/getClients";
import { format } from "date-fns";
import { PlusIcon, UsersIcon } from "lucide-react";
import Link from "next/link";

const ClientsPage = async () => {
  const clients = await getClients();

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-semibold">Clients</h1>
          <p className="text-muted-foreground">
            Manage your clients and contact details.
          </p>
        </div>

        <Button>
          <Link
            href={"/clients/create" as never}
            className={"flex items-center justify-center gap-2"}>
            <PlusIcon /> Add client
          </Link>
        </Button>
      </div>

      {clients.length === 0 ?
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="size-5" /> No clients yet
            </CardTitle>
            <CardDescription>
              Create your first client to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>
              <Link href={"/clients/create" as never}>
                <PlusIcon /> Create client
              </Link>
            </Button>
          </CardContent>
        </Card>
      : <Card>
          <CardHeader>
            <CardTitle>Your clients</CardTitle>
            <CardDescription>
              {clients.length} client{clients.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Birthdate</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {c.address}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {c.contactInformation}
                    </TableCell>
                    <TableCell>{c.gender ?? "-"}</TableCell>
                    <TableCell>
                      {c.birthdate ? format(c.birthdate, "dd MMM yyyy") : "-"}
                    </TableCell>
                    <TableCell>{format(c.createdAt, "dd MMM yyyy")}</TableCell>
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

export default ClientsPage;
