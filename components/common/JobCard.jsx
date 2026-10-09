import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "../ui/Button";
import Link from "next/link";
import { useJobs } from "@/hooks/useJobs";

export function JobCard({ job }) {
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
          href={`/seekers?jobId=${job.docId}`}
          className="flex items-center gap-2"
        >
          View & apply <ArrowRight />
        </Link>
      </Button>
    </article>
  );
}