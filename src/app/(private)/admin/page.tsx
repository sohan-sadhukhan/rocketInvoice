import { auth } from "@/lib/auth";
import { getAllUsers } from "@/server/admin/getAllUsers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const AdminPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const users = await getAllUsers();

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="mt-2 text-gray-600">Manage all users in the system</p>
      </div>
      <DataTable
        columns={columns}
        data={users}
      />
    </div>
  );
};

export default AdminPage;
