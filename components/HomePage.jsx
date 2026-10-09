"use client";
import {
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  Building2,
  Car,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Fuel,
  Globe2,
  Hammer,
  Handshake,
  Hotel,
  PackageCheck,
  Plane,
  PlugZap,
  Search,
  ShieldCheck,
  UsersRound,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { SectionHeading } from "./common/SectionHeading";
import { FraudBand } from "./common/FraudBand";
import { JobCard } from "./common/JobCard";
import { useRouter } from "next/navigation";
import { useJobs } from "@/hooks/useJobs";

const stats = [
  ["12+", "Years of combined recruitment experience"],
  ["6", "Gulf and international destinations"],
  ["10", "Industries covered"],
  ["100%", "Verified employer requirements"],
];

const processSteps = [
  [
    "01",
    "Share your profile",
    "Register your trade, experience and preferred destination in minutes.",
  ],
  [
    "02",
    "Screening & matching",
    "We check your documents and match you with verified requirements.",
  ],
  [
    "03",
    "Employer interview",
    "Meet the employer with clear guidance on salary and conditions.",
  ],
  [
    "04",
    "Offer & mobilisation",
    "Contract, medical, visa and travel support until departure.",
  ],
];

const faqs = [
  [
    "Do I have to pay to register?",
    "Registration of your profile is free. Any official cost is always explained in writing with a receipt before you proceed.",
  ],
  [
    "How do I know a job is genuine?",
    "Every listing carries a reference number. Use our Verify Job page or WhatsApp us to confirm the employer and offer before paying or travelling.",
  ],
  [
    "Which countries do you recruit for?",
    "We currently focus on the UAE, Saudi Arabia, Qatar, Oman and Kuwait, with selected roles in other destinations.",
  ],
  [
    "What documents do I need?",
    "A valid passport, your CV, trade certificates and experience letters. We guide you through medical, visa and attestation steps.",
  ],
  [
    "How long does the process take?",
    "It depends on the employer and destination. Most verified requirements move from shortlisting to mobilisation within 4–10 weeks.",
  ],
];

const countries = [
  {
    slug: "uae",
    name: "United Arab Emirates",
    short: "UAE",
    flag: "🇦🇪",
    roles: "Construction, logistics, hospitality",
    note: "Fast-growing opportunities across Dubai, Abu Dhabi and the Northern Emirates.",
  },
  {
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    short: "Saudi Arabia",
    flag: "🇸🇦",
    roles: "Oil & gas, infrastructure, facilities",
    note: "Major projects and long-term workforce demand across the Kingdom.",
  },
  {
    slug: "qatar",
    name: "Qatar",
    short: "Qatar",
    flag: "🇶🇦",
    roles: "Facilities, hospitality, skilled trades",
    note: "Verified roles supporting infrastructure and service industries.",
  },
  {
    slug: "oman",
    name: "Oman",
    short: "Oman",
    flag: "🇴🇲",
    roles: "Manufacturing, automotive, maintenance",
    note: "Stable opportunities with established employers across Oman.",
  },
  {
    slug: "kuwait",
    name: "Kuwait",
    short: "Kuwait",
    flag: "🇰🇼",
    roles: "Oil & gas, construction, logistics",
    note: "Technical and trade openings with verified employers.",
  },
  {
    slug: "other-destinations",
    name: "Other Destinations",
    short: "Other",
    flag: "🌍",
    roles: "Europe, Asia and international markets",
    note: "Selected opportunities beyond the Gulf, subject to verified demand.",
  },
];

export const industries = [
  {
    name: "Construction",
    icon: Building2,
    text: "Masons, carpenters, steel fixers, supervisors and operators.",
  },
  {
    name: "Oil & Gas",
    icon: Fuel,
    text: "Fitters, riggers, welders, technicians and safety teams.",
  },
  {
    name: "Manufacturing",
    icon: Factory,
    text: "Machine operators, fabricators, assemblers and quality staff.",
  },
  {
    name: "Logistics",
    icon: PackageCheck,
    text: "Drivers, warehouse staff, forklift operators and coordinators.",
  },
  {
    name: "Hospitality",
    icon: Hotel,
    text: "Chefs, stewards, housekeepers and guest service teams.",
  },
  {
    name: "Facility Management",
    icon: BriefcaseBusiness,
    text: "MEP technicians, cleaners, security and maintenance teams.",
  },
  {
    name: "Automotive",
    icon: Car,
    text: "Mechanics, electricians, painters and diagnostic technicians.",
  },
  {
    name: "Electrical",
    icon: PlugZap,
    text: "Industrial, commercial and maintenance electricians.",
  },
  {
    name: "Plumbing",
    icon: Wrench,
    text: "Pipe fitters, plumbers and sanitary technicians.",
  },
  {
    name: "Skilled Trades",
    icon: Hammer,
    text: "Welders, fabricators, machinists and specialist trades.",
  },
];

function JobAlertForm() {
  const [done, setDone] = useState(false);
  function submit(e) {
    e.preventDefault();
    setDone(true);
  }
  if (done)
    return (
      <p className="flex items-center gap-2 rounded-md bg-success-soft p-4 text-sm font-semibold text-foreground">
        <CheckCircle2 className="size-5 text-success" /> Thank you — job alerts
        will start once email delivery is activated.
      </p>
    );
  return (
    <form
      onSubmit={submit}
      className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
      aria-label="Job alert signup"
    >
      <Input
        required
        type="email"
        maxLength={255}
        placeholder="Email address"
        aria-label="Email address"
        className="h-12"
      />
      <Input
        required
        maxLength={100}
        placeholder="Your trade (e.g. Electrician)"
        aria-label="Your trade"
        className="h-12"
      />
      <Button type="submit" size="lg" variant="highlight">
        <BellRing /> Get job alerts
      </Button>
    </form>
  );
}

export function HomePage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);
  const [query, setQuery] = useState("");
  const { jobs, isLoading, error } = useJobs();

  const countries = [...new Set(jobs.map((j) => j.country).filter(Boolean))];
  const featured = jobs.slice(0, 3);

  function goToJobs({ country, q } = {}) {
    const params = new URLSearchParams();
    if (country && country !== "All") params.set("country", country);
    if (q?.trim()) params.set("q", q.trim());
    const qs = params.toString();
    router.push(qs ? `/jobs?${qs}` : "/jobs");
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary">
        <img
          src="/heroimg.jpg"
          alt="Indian skilled worker at an airport departure hall, ready for an overseas job"
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="container relative grid min-h-[calc(100svh-6.5rem)] items-center py-20">
          <div className="max-w-2xl text-primary-foreground">
            <p className="eyebrow flex items-center gap-3 text-highlight">
              <span className="h-px w-8 bg-highlight" />
              Overseas recruitment & placement
            </p>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.04] sm:text-6xl lg:text-7xl">
              Your Trusted Partner for Overseas Workforce Solutions
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
              We connect skilled Indian workers with verified international
              employers — with clear processes, honest guidance and support at
              every step.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button asChild size="xl" variant="highlight">
                <Link href="/jobs" className="flex items-center gap-2">
                  Find Overseas Jobs <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="xl" variant="heroOutline">
                <Link href="/employers" className="flex items-center gap-2">
                  Hire Workers
                </Link>
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-primary-foreground/85">
              {[
                "Verified employers only",
                "Transparent process",
                "Pre-departure support",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-highlight" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-surface">
        <div className="container grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label}>
              <p className="font-display text-4xl font-bold text-secondary">
                {value}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured jobs */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Current openings"
            title="Featured overseas jobs"
            text="Search verified requirements by trade and destination. Listings are representative samples until final employer validation is completed."
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToJobs({ q: query });
            }}
            className="mb-7 grid gap-3 rounded-md border border-border bg-card p-4 shadow-sm md:grid-cols-[1fr_220px_auto]"
          >
            <label className="relative">
              <Search className="absolute left-3 top-3.5 size-5 text-muted-foreground" />
              <Input
                className="h-12 pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search job title, company or city"
                aria-label="Search jobs"
              />
            </label>
            <select
              className="h-12 rounded-md border border-input bg-background px-3 text-sm"
              defaultValue="All"
              onChange={(e) => goToJobs({ country: e.target.value, q: query })}
              aria-label="Filter by country"
            >
              <option>All</option>
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <Button type="submit" size="lg">
              Search
            </Button>
          </form>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((j) => (
              <JobCard key={j.docId} job={j} />
            ))}
          </div>

          {isLoading && (
            <p className="text-muted-foreground">Loading current openings…</p>
          )}
          {error && (
            <p className="text-destructive">
              Couldn&apos;t load jobs right now. Please try again later.
            </p>
          )}
          {!isLoading && !error && featured.length === 0 && (
            <div className="rounded-md bg-muted p-8 text-center">
              <p className="font-bold">No openings right now.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Register your CV and we&apos;ll contact you when a match opens.
              </p>
            </div>
          )}

          {jobs.length > 3 && (
            <div className="mt-8 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/jobs" className="flex items-center gap-2">
                  View more jobs <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Countries */}
      <section className="section bg-surface">
        <div className="container">
          <SectionHeading
            eyebrow="Destinations"
            title="Countries we recruit for"
            text="Verified opportunities across the Gulf and selected international markets."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((c) => (
              <Link
                key={c.slug}
                href="/countries/$slug"
                params={{ slug: c.slug }}
                className="card p-6"
              >
                <span className="text-3xl">{c.flag}</span>
                <h3 className="mt-3 font-display text-xl font-bold">
                  {c.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {c.note}
                </p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-secondary">
                  Explore roles <ArrowRight className="size-4" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Industries"
            title="Skilled people for essential industries"
            text="Role-focused recruitment for trades, technical teams, operations and service workforces."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {industries.map(({ name, icon: Icon }) => (
              <Link
                key={name}
                href="/industries"
                className="card flex flex-col items-start gap-3 p-5"
              >
                <Icon className="size-6 text-secondary" />
                <span className="text-sm font-bold">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container">
          <div className="mb-12 max-w-2xl">
            <p className="eyebrow text-highlight">How it works</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-4xl">
              A clear path from registration to departure
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map(([n, t, d]) => (
              <article
                key={n}
                className="rounded-md border border-primary-foreground/15 p-6"
              >
                <span className="font-display text-3xl font-bold text-highlight">
                  {n}
                </span>
                <h3 className="mt-4 font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-primary-foreground/65">
                  {d}
                </p>
              </article>
            ))}
          </div>
          <Button asChild variant="heroOutline" size="lg" className="mt-10">
            <Link
              href="/recruitment-process"
              className="flex items-center gap-2"
            >
              See the full recruitment process <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <FraudBand />

      {/* Audiences */}
      <section className="section">
        <div className="container grid gap-6 lg:grid-cols-2">
          <article className="card p-8">
            <UsersRound className="size-9 text-secondary" />
            <h3 className="mt-5 font-display text-2xl font-bold">
              For job seekers
            </h3>
            <ul className="mt-5 space-y-3 text-sm leading-6">
              {[
                "Free profile registration and CV submission",
                "Verified job references you can check",
                "Guidance on documents, medical and visa",
                "Pre-departure orientation and support",
              ].map((x) => (
                <li key={x} className="flex gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-success" />
                  {x}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-7" variant="highlight">
              <Link href="/job-seekers" className="flex items-center gap-2">
                Register as a candidate <ArrowRight />
              </Link>
            </Button>
          </article>
          <article className="card p-8">
            <Handshake className="size-9 text-secondary" />
            <h3 className="mt-5 font-display text-2xl font-bold">
              For employers
            </h3>
            <ul className="mt-5 space-y-3 text-sm leading-6">
              {[
                "Targeted sourcing across Indian trade networks",
                "Screening, trade testing and shortlisting",
                "Interview and selection coordination",
                "Documentation and mobilisation support",
              ].map((x) => (
                <li key={x} className="flex gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-success" />
                  {x}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-7" variant="secondaryOutline">
              <Link href="/employers" className="flex items-center gap-2">
                Share your requirement <ArrowRight />
              </Link>
            </Button>
          </article>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-surface">
        <div className="container">
          <SectionHeading
            eyebrow="Testimonials"
            title="What candidates and employers say"
            text="Representative feedback shown until verified client testimonials are published."
            center
          />
          <div className="grid gap-5 md:grid-cols-3">
            {[
              [
                "The process was clear from the first call. I knew the salary, the employer and every step before I travelled.",
                "Electrician, placed in UAE",
              ],
              [
                "Career Dunes verified everything and kept receipts for each stage. I felt safe throughout.",
                "Pipe fitter, placed in Saudi Arabia",
              ],
              [
                "A reliable partner for our facility workforce. Screening and mobilisation were well organised.",
                "HR Manager, facility management company",
              ],
            ].map(([quote, by]) => (
              <figure key={by} className="card p-6">
                <blockquote className="text-sm leading-7 text-muted-foreground">
                  “{quote}”
                </blockquote>
                <figcaption className="mt-5 text-sm font-bold text-foreground">
                  {by}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + job alerts */}
      <section className="section">
        <div className="container grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow="FAQ" title="Common questions" />
            <div className="divide-y divide-border border-y border-border">
              {faqs.map(([q, a], i) => (
                <div key={q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold"
                  >
                    {q}
                    <ChevronDown
                      className={`size-5 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <p className="pb-5 text-sm leading-7 text-muted-foreground">
                      {a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="card h-fit p-7">
            <BellRing className="size-8 text-secondary" />
            <h3 className="mt-4 font-display text-2xl font-bold">
              Get new jobs in your inbox
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Tell us your trade and we’ll alert you when a matching verified
              requirement opens. Delivery activates once our email setup is
              complete.
            </p>
            <div className="mt-6">
              <JobAlertForm />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-y border-highlight/40 bg-highlight-soft py-14">
        <div className="container grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow text-highlight-strong">Your next step</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
              Ready to work abroad — or build your workforce?
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              Register as a candidate or share your manpower requirement. Our
              team responds during working hours.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="xl" variant="highlight">
              <Link href="/job-seekers" className="flex items-center gap-2">
                Register now <Plane />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/employers">Request manpower</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="section">
        <div className="container grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              ShieldCheck,
              "Verified employers",
              "Every requirement is checked before listing.",
            ],
            [
              FileCheck2,
              "Clear documentation",
              "Contracts, receipts and records at every stage.",
            ],
            [
              ClipboardCheck,
              "Structured screening",
              "Trade, experience and document checks.",
            ],
            [
              Globe2,
              "Gulf expertise",
              "Focused on UAE, Saudi Arabia, Qatar, Oman and Kuwait.",
            ],
          ].map(([I, t, d]) => {
            const Icon = I;
            return (
              <div key={String(t)} className="flex gap-4">
                <Icon className="size-7 shrink-0 text-secondary" />
                <div>
                  <h3 className="font-bold">{String(t)}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {String(d)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
