import GetStarted from "@/components/GetStarted";
import { Button } from "@/components/shadcnui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import Link from "next/link";

const featureCards = [
  {
    title: "Fast invoicing",
    description:
      "Create polished invoices in minutes with reusable details and a clear workflow.",
  },
  {
    title: "Client focus",
    description:
      "Keep customer records organized so follow-up, billing, and communication stay simple.",
  },
  {
    title: "Modern dashboard",
    description:
      "Track invoice status, recent activity, and the basics of your business from one place.",
  },
] as const;

const goals = [
  "Make billing feel approachable for solo founders and small teams.",
  "Bring a clean experience for creating, reviewing, and sending invoices.",
  "Help businesses grow without fighting spreadsheets or disconnected tools.",
] as const;

const versions = [
  "v0.1 — Initial public launch with core invoice and client management.",
  "v0.2 — Expanded dashboard experience and polished public pages.",
] as const;

const HomePage = () => {
  return (
    <section className="space-y-10">
      <div className="space-y-5">
        <p className="text-primary text-sm font-medium tracking-[0.3em] uppercase">
          Built for modern small businesses
        </p>
        <h1 className="font-heading max-w-3xl text-4xl font-semibold sm:text-5xl">
          RocketInvoice helps you send polished invoices and keep your business
          moving.
        </h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          RocketInvoice is an open-source invoicing platform designed to make
          billing simple, fast, and professional for freelancers, consultants,
          and growing teams.
        </p>
        <div className="flex flex-wrap gap-3">
          <GetStarted />
          <Button variant="outline">
            <Link href="/about">Learn more</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {featureCards.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Goals</CardTitle>
            <CardDescription>
              RocketInvoice focuses on clarity, speed, and dependable billing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {goals.map((goal) => (
              <p
                key={goal}
                className="text-muted-foreground text-sm">
                • {goal}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current version</CardTitle>
            <CardDescription>
              A growing release with a foundation for everyday invoicing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {versions.map((version) => (
              <p
                key={version}
                className="text-muted-foreground text-sm">
                {version}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contribute</CardTitle>
          <CardDescription>
            Want to help shape RocketInvoice? Contributions are welcome on
            GitHub.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">
            <Link
              href="https://github.com/sohan-sadhukhan/rocketInvoice"
              target="_blank"
              rel="noreferrer">
              Visit the GitHub repository
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default HomePage;
