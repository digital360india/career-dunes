"use client";
import { useMemo, useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Input } from "./ui/Input";
import { FraudBand } from "./common/FraudBand";
import { PageHero } from "./common/PageHero";
import { Button } from "./ui/Button";
import Link from "next/link";

function JobCard({ job }) {
  return (
    <article className="card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold text-secondary">
          {job.id}
        </span>
        {job.urgent && (
          <span className="rounded-full bg-highlight-soft px-2.5 py-1 text-[11px] font-bold text-highlight-strong">
            Urgent hiring
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-foreground">
        {job.title}
      </h3>
      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="size-4 text-secondary" />
        {job.country} · {job.industry}
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-border py-4 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Monthly salary</dt>
          <dd className="mt-1 font-bold text-foreground">{job.salary}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Experience</dt>
          <dd className="mt-1 font-bold text-foreground">{job.experience}</dd>
        </div>
      </dl>
      <Button asChild className="mt-5 w-full" variant="default">
        <Link href="/job-seekers" className="flex items-center gap-2">
          Apply for this job <ArrowRight />
        </Link>
      </Button>
    </article>
  );
}

const jobs = [
  { id: "CD-1042", title: "Industrial Electrician", country: "UAE", salary: "AED 1,800–2,400", experience: "3–5 years", industry: "Electrical", urgent: true },
  { id: "CD-1041", title: "Pipe Fitter", country: "Saudi Arabia", salary: "SAR 1,700–2,200", experience: "3+ years", industry: "Oil & Gas", urgent: true },
  { id: "CD-1039", title: "HVAC Technician", country: "Qatar", salary: "QAR 2,000–2,600", experience: "2–4 years", industry: "Facility Management", urgent: false },
  { id: "CD-1038", title: "Heavy Vehicle Mechanic", country: "Oman", salary: "OMR 180–240", experience: "4+ years", industry: "Automotive", urgent: false },
  { id: "CD-1035", title: "Warehouse Picker", country: "Kuwait", salary: "KWD 120–160", experience: "1–2 years", industry: "Logistics", urgent: false },
  { id: "CD-1032", title: "Commis Chef", country: "UAE", salary: "AED 1,500–2,000", experience: "2+ years", industry: "Hospitality", urgent: false },
];

export function JobsPage({compact = false, isLoading = false}) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All");
  //   const { data: jobs = [], isLoading } = useQuery(publishedJobsQuery);
  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (country === "All" || j.country === country) &&
          `${j.title} ${j.industry}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, country],
  );
  return (
    <main>
      <PageHero
        eyebrow="Current jobs"
        title="Find an overseas job that matches your skills"
        text="Search verified requirements by trade, industry and destination. Sample listings are clearly presented while final employer validation is completed."
      >
        <Button asChild variant="highlight" size="lg">
          <Link href="/job-seekers">Register your CV</Link>
        </Button>
      </PageHero>
      <section className="section bg-surface">
        <div className="container">
          {/* <JobsExplorer  */}
          <div>
            <div className="mb-7 grid gap-3 rounded-md border border-border bg-card p-4 shadow-sm md:grid-cols-[1fr_220px_auto]">
              <label className="relative">
                <Search className="absolute left-3 top-3.5 size-5 text-muted-foreground" />
                <Input
                  className="h-12 pl-10"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search job title or trade"
                  aria-label="Search jobs"
                />
              </label>
              <select
                className="h-12 rounded-md border border-input bg-background px-3 text-sm"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                aria-label="Filter by country"
              >
                <option>All</option>
                {[...new Set(jobs.map((j) => j.country))].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <Button
                size="lg"
                onClick={() => {
                  setQuery("");
                  setCountry("All");
                }}
                variant="outline"
              >
                Clear
              </Button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, compact ? 3 : 99).map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
            {isLoading && (
              <p className="text-muted-foreground">Loading current openings…</p>
            )}
            {!isLoading && filtered.length === 0 && (
              <div className="rounded-md bg-muted p-8 text-center">
                <p className="font-bold">No jobs match your search.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try another job title or country.
                </p>
              </div>
            )}
          </div>
          <p className="mt-8 rounded-md bg-muted p-4 text-xs leading-6 text-muted-foreground">
            <strong>Important:</strong> Current listings are representative
            sample roles until employer requirements are verified. Always
            confirm the job reference through our verification page.
          </p>
        </div>
      </section>
      <FraudBand />
    </main>
  );
}
