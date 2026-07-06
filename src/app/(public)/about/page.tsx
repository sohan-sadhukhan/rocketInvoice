import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";

const highlights = [
  {
    title: "Purpose",
    description:
      "RocketInvoice exists to make the billing experience feel less stressful and more professional.",
  },
  {
    title: "Workflow",
    description:
      "Create invoices, organize clients, and keep your records in one place without friction.",
  },
  {
    title: "Community",
    description:
      "The project is open to feedback, ideas, and contributions from anyone who wants to help.",
  },
] as const;

const AboutPage = () => {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-semibold">
          About RocketInvoice
        </h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          RocketInvoice is a practical invoicing tool built for people who want
          better billing habits without the clutter of overly complex software.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Why it exists</CardTitle>
          <CardDescription>
            The goal is simple: help small businesses invoice clearly, move
            faster, and spend less time on admin.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>
            RocketInvoice combines a straightforward interface with the
            essentials needed to manage invoices and customer relationships.
          </p>
          <p>
            It is designed to grow with your workflow, stay easy to understand,
            and remain open for improvements from the community.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default AboutPage;
