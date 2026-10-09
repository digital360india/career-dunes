"use client";
import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { FraudBand } from "./common/FraudBand";
import { PageHero } from "./common/PageHero";
import { useJobs } from "@/hooks/useJobs";
import { useSearchParams } from "next/navigation";
import { JobCard } from "./common/JobCard";

export function JobsPage({ compact = false }) {
  const { jobs, isLoading, error } = useJobs();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [country, setCountry] = useState(searchParams.get("country") ?? "All");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setCountry(searchParams.get("country") ?? "All");
  }, [searchParams]);

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
          <Link href="/seekers">Register your CV</Link>
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
