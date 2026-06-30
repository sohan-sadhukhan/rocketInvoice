import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <section className="space-y-4">
      <h1 className="font-heading text-3xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back, {session?.user.name ?? "User"}.
      </p>
    </section>
  );
};

export default DashboardPage;
