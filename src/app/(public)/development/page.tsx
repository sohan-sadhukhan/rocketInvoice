import { Button } from "@/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import Link from "next/link";

const roadmap = [
  "Refine the invoicing experience for faster day-to-day use.",
  "Improve reporting and administration tools for better visibility.",
  "Expand integrations and quality of life improvements over time.",
] as const;

const DevelopmentPage = () => {
  return (
    <section className="space-y-8">
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-semibold">Development</h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          RocketInvoice is actively evolving with a focus on a dependable,
          approachable invoicing experience.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current focus</CardTitle>
          <CardDescription>
            The project is centered on clean product fundamentals and practical
            improvements.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          {roadmap.map((item) => (
            <p key={item}>• {item}</p>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Version history</CardTitle>
          <CardDescription>
            A simple overview of where the product is today and where it is
            headed.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-3 text-sm">
          <p>v0.1 — Early public launch with core invoice and client flows.</p>
          <p>v0.2 — Public marketing pages and a more polished dashboard.</p>
          <p>Next — Continued refinement of the overall invoicing workflow.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contribute</CardTitle>
          <CardDescription>
            If you want to help build RocketInvoice, the repository is open.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            <Link
              href="https://github.com/sohan-sadhukhan/rocketInvoice"
              target="_blank"
              rel="noreferrer">
              Open GitHub
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default DevelopmentPage;
