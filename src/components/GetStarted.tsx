import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "./shadcnui/button";

const GetStarted = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const href = session ? "/dashboard" : "/auth/signup";

  return (
    <Button>
      <Link href={href}>Get started</Link>
    </Button>
  );
};

export default GetStarted;
