import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

const about =
  "I'm Hussein, an AI engineer in Slovenia, born and raised in Burundi. I build APIs that give AI agents data from the web, and I keep them as simple as I can. I also play a lot of football.";

const focus = [
  {
    label: "Agents",
    text: "Designing workflows where models can use tools, reach data, and complete useful work.",
  },
  {
    label: "Web data",
    text: "Researching APIs and building reliable extraction systems for messy public sources.",
  },
  {
    label: "Automation",
    text: "Connecting APIs, workers, databases, and AI models into systems that can run without hand-holding.",
  },
  {
    label: "Reliability",
    text: "Testing live systems, handling failures, and checking that the output is actually useful.",
  },
];

const stack = [
  { label: "Language", text: "TypeScript" },
  { label: "Runtime", text: "Bun" },
  { label: "APIs", text: "Hono" },
  { label: "Database", text: "Postgres, Neon, Drizzle" },
  { label: "Cache", text: "Upstash" },
  { label: "Hosting", text: "Vercel, Railway, Cloudflare Workers" },
  { label: "UI", text: "React, TanStack, Tailwind" },
  { label: "Auth", text: "better-auth" },
  { label: "Payments", text: "Stripe" },
  { label: "Email", text: "Resend" },
  { label: "Analytics", text: "PostHog" },
  { label: "Tooling", text: "Turborepo, Vitest, oxlint, zod" },
];

// Rows without an href render as plain text, without the arrow.
const contacts: { label: string; value: string; href?: string }[] = [
  {
    label: "Email",
    value: "hussein@hakiiizimana.com",
    href: "mailto:hussein@hakiiizimana.com",
  },
  {
    label: "Github",
    value: "hakiiizimana",
    href: "https://github.com/hakiiizimana",
  },
  { label: "Location", value: "Slovenia" },
];

// Short text section, styled like the template's About block.
function TextSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="my-9">
      <h3 className="mb-1 font-medium text-neutral-900 dark:text-neutral-50">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-300">{children}</p>
    </section>
  );
}

// Section of two-column rows, styled like the template's Work Experience block.
function RowSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="my-14">
      <h3 className="mb-6 font-medium text-neutral-900 dark:text-neutral-50">{title}</h3>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

// Muted label on the left, content on the right.
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex">
      <div className="mr-8 w-full max-w-[100px] text-neutral-500 dark:text-neutral-400">
        {label}
      </div>
      <div className="flex flex-1 flex-col text-neutral-900 dark:text-neutral-50">
        {children}
      </div>
    </div>
  );
}

// The whole site is this one CV page. Layout mirrors ibelick/nextjs-resume, minus the
// avatar, in Geist. The column comes from the root layout.
export default function Home() {
  return (
    <div className="py-20">
      <section>
        <h1 className="mb-0.5 font-medium text-neutral-900 text-xl dark:text-neutral-50">
          Hussein Hakizimana
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300">AI Engineer</p>
      </section>

      <TextSection title="About">{about}</TextSection>

      <RowSection title="Technical Focus">
        {focus.map((item) => (
          <Row label={item.label} key={item.label}>
            <h4>{item.text}</h4>
          </Row>
        ))}
      </RowSection>

      <RowSection title="Stack">
        {stack.map((item) => (
          <Row label={item.label} key={item.label}>
            {item.text}
          </Row>
        ))}
      </RowSection>

      <RowSection title="Contact">
        {contacts.map((contact) => (
          <Row label={contact.label} key={contact.label}>
            {contact.href ? (
              <a
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                {contact.value}
                <ArrowUpRight className="size-3" />
              </a>
            ) : (
              <span>{contact.value}</span>
            )}
          </Row>
        ))}
      </RowSection>
    </div>
  );
}
