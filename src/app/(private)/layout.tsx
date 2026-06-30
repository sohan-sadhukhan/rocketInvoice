import PrivateHeader from "@/components/Header/PrivateHeader";
import { auth } from "@/lib/auth";
import { LayoutChildrenProps } from "@/lib/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const PrivateLayout = async ({ children }: LayoutChildrenProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin" as never);
  }

  return (
    <>
      <PrivateHeader />
      <div className="mx-auto w-full max-w-7xl px-6 pt-24 pb-12">{children}</div>
    </>
  );
};

export default PrivateLayout;
