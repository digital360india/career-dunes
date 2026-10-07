"use client";
import { useMemo, useState } from "react";
import { ArrowRight, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { FraudBand } from "./common/FraudBand";
import { PageHero } from "./common/PageHero";
import { useJobs } from "@/hooks/useJobs";

function JobCard({ job }) {
  const location = [job.city, job.country].filter(Boolean).join(", ");

  return (
    <article className="card flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-bold text-secondary">
          CD-{job.docId.slice(0, 5).toUpperCase()}
        </span>
        {job.type && (
          <span className="rounded-full bg-highlight-soft px-2.5 py-1 text-[11px] font-bold text-highlight-strong">
            {job.type}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-display text-xl font-bold text-foreground">
        {job.title}
      </h3>
      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="size-4 text-secondary" />
        {location}
        {job.company ? ` · ${job.company}` : ""}
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-border py-4 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Monthly salary</dt>
          <dd className="mt-1 font-bold text-foreground">{job.salary}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Vacancies</dt>
          <dd className="mt-1 font-bold text-foreground">{job.vacancies}</dd>
        </div>
      </dl>
      <Button asChild className="mt-5 w-full" variant="default">
        <Link
          href={`/jobs/${job.docId}`}
          className="flex items-center gap-2"
        >
          View & apply <ArrowRight />
        </Link>
      </Button>
    </article>
  );
}

export function JobsPage({ compact = false }) {
  const { jobs, isLoading, error } = useJobs();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All");

  const countries = useMemo(
    () => [...new Set(jobs.map((j) => j.country).filter(Boolean))],
    [jobs],
  );

  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (country === "All" || j.country === country) &&
          `${j.title ?? ""} ${j.company ?? ""} ${j.city ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [jobs, query, country],
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
          <div>
            <div className="mb-7 grid gap-3 rounded-md border border-border bg-card p-4 shadow-sm md:grid-cols-[1fr_220px_auto]">
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
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                aria-label="Filter by country"
              >
                <option>All</option>
                {countries.map((c) => (
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
              {filtered.slice(0, compact ? 3 : undefined).map((j) => (
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
            {!isLoading && !error && filtered.length === 0 && (
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
