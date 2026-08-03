import { ArrowRight, PackagePlus, PlusCircle, UsersRound } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "Add client",
    description: "Create a new client profile and start invoicing faster.",
    href: "/clients/create",
    icon: UsersRound,
  },
  {
    title: "Add product",
    description: "Add a new item to your catalog with pricing and tax details.",
    href: "/products/create",
    icon: PlusCircle,
  },
  {
    title: "Create Invoice",
    description:
      "Launch another product entry and keep your offerings current.",
    href: "/invoices/create",
    icon: PackagePlus,
  },
] as const;

const QuickActions = () => {
  return (
    <>
      <section className="bg-card/70 ring-foreground/5 dark:ring-foreground/10 hidden space-y-4 rounded-4xl border p-6 shadow-sm ring-1 md:block">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold">
              Quick actions
            </h2>
            <p className="text-muted-foreground text-sm">
              Jump back into your most common workflows.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href as never}
                className="group bg-background/70 hover:bg-muted/60 rounded-3xl border p-4 shadow-sm transition-all hover:-translate-y-0.5">
                <div className="flex items-start justify-between">
                  <div className="bg-primary/10 text-primary flex gap-2 rounded-2xl px-3 py-2 text-sm">
                    <Icon className="size-4" />
                    <h3 className="font-medium">{action.title}</h3>
                  </div>
                  <ArrowRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-1" />
                </div>

                <div className="mt-4 space-y-1">
                  <p className="text-muted-foreground text-sm">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="md:hidden">
        <h2 className="font-heading pb-3 text-lg font-semibold">
          Quick actions
        </h2>

        <div className="border-primary/15 flex items-center justify-between rounded-full border px-1 py-0.5">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href as never}
                className="">
                <div className="flex items-start justify-between">
                  <div className="bg-primary/10 text-primary my-1 flex gap-2 rounded-2xl px-2 py-2 text-xs">
                    <Icon className="size-3" />
                    <h3 className="font-medium">{action.title}</h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default QuickActions;
