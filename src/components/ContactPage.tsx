import {
  ArrowUpRightIcon,
  BugIcon,
  MailIcon,
  MessageSquareIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ContactPage = () => {
  return (
    <section className="mx-auto w-full">
      {/* Header */}
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Contact Us
        </h1>

        <p className="text-muted-foreground mt-4 text-base leading-7">
          Have a question, found a bug, or want to share feedback? Choose the
          best way to get in touch with us.
        </p>
      </header>

      {/* Contact Options */}
      <section
        aria-label="Contact options"
        className="mx-auto mt-12 grid gap-6 md:grid-cols-2">
        <article className="hover:bg-muted/40 rounded-xl border p-6 transition-colors">
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
            <MailIcon
              className="size-5"
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-5 font-semibold">Email Support</h2>

          <p className="text-muted-foreground mt-2 text-sm leading-6">
            For general questions, support requests, account-related issues, or
            feedback, send us an email.
          </p>

          <a
            href="mailto:mrsohansadhukhan@gmail.com"
            className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline">
            mrsohansadhukhan@gmail.com
            <ArrowUpRightIcon
              className="size-3.5"
              aria-hidden="true"
            />
          </a>
        </article>

        <article className="hover:bg-muted/40 rounded-xl border p-6 transition-colors">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
            <Image
              src="/github.svg"
              alt=""
              width={20}
              height={20}
              className="size-5 dark:invert"
            />
          </div>

          <h2 className="mt-5 font-semibold">GitHub Issues</h2>

          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Found a bug or have an idea for a new feature? Open an issue on
            GitHub so it can be tracked and discussed.
          </p>

          <Link
            href="https://github.com/sohan-sadhukhan/rocketInvoice/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline">
            Open GitHub Issues
            <ArrowUpRightIcon
              className="size-3.5"
              aria-hidden="true"
            />
          </Link>
        </article>

        <article className="hover:bg-muted/40 rounded-xl border p-6 transition-colors">
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
            <BugIcon
              className="size-5"
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-5 font-semibold">Report a Bug</h2>

          <p className="text-muted-foreground mt-2 text-sm leading-6">
            If something is not working as expected, please include the steps to
            reproduce the issue and any relevant details.
          </p>

          <Link
            href="https://github.com/sohan-sadhukhan/rocketInvoice/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline">
            Report an Issue
            <ArrowUpRightIcon
              className="size-3.5"
              aria-hidden="true"
            />
          </Link>
        </article>

        <article className="hover:bg-muted/40 rounded-xl border p-6 transition-colors">
          <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
            <MessageSquareIcon
              className="size-5"
              aria-hidden="true"
            />
          </div>

          <h2 className="mt-5 font-semibold">Feedback & Suggestions</h2>

          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Have an idea that could make RocketInvoice better? We&apos;d love to
            hear your suggestions and feedback.
          </p>

          <a
            href="mailto:mrsohansadhukhan@gmail.com?subject=RocketInvoice%20Feedback"
            className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline">
            Send Feedback
            <ArrowUpRightIcon
              className="size-3.5"
              aria-hidden="true"
            />
          </a>
        </article>
      </section>

      {/* Help */}
      <section className="bg-muted/50 mx-auto mt-10 rounded-xl border p-6 text-center sm:p-8">
        <h2 className="font-semibold">Need help?</h2>

        <p className="text-muted-foreground mx-auto mt-2 max-w-2xl text-sm leading-6">
          For the fastest response, please provide as much detail as possible
          when contacting us. For bugs, include the steps that caused the
          problem and any relevant error messages.
        </p>
      </section>
    </section>
  );
};

export default ContactPage;
