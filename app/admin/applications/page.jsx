"use client";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const STATUSES = [
  {
    value: "pending",
    label: "Pending",
    badge:
      "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
    active:
      "border-amber-500 bg-amber-500 text-white hover:bg-amber-500/90 hover:text-white",
  },
  {
    value: "shortlisted",
    label: "Shortlisted",
    badge:
      "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
    active:
      "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-600/90 hover:text-white",
  },
  {
    value: "rejected",
    label: "Rejected",
    badge:
      "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-400/20",
    active:
      "border-red-600 bg-red-600 text-white hover:bg-red-600/90 hover:text-white",
  },
];

const statusOf = (a) => a.status || "pending";

const selectCls =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

function Icon({ children, className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (
    parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")
  ).toUpperCase();
}

function formatDate(ts) {
  const d = ts?.toDate?.();
  return d ? d.toLocaleDateString("en-GB") : "Just now";
}

function Detail({ icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="wrap-break-word text-sm font-medium text-foreground">
          {children}
        </p>
      </div>
    </div>
  );
}

function ApplicationCard({ app, onStatus }) {
  const status = statusOf(app);
  const current = STATUSES.find((s) => s.value === status) || STATUSES[0];

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      {/* Applicant header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary"
            aria-hidden="true"
          >
            {initials(app.name)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-semibold text-foreground">
                {app.name}
              </h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${current.badge}`}
              >
                {current.label}
              </span>
            </div>
            <div className="mt-1 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4">
              {app.email && (
                <a
                  href={`mailto:${app.email}`}
                  className="inline-flex items-center gap-1.5 break-all hover:text-primary"
                >
                  <Icon>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </Icon>
                  {app.email}
                </a>
              )}
              {app.phone && (
                <a
                  href={`tel:${app.phone}`}
                  className="inline-flex items-center gap-1.5 hover:text-primary"
                >
                  <Icon>
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                  </Icon>
                  {app.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Status control */}
        <div
          role="group"
          aria-label={`Change status for ${app.name}`}
          className="grid grid-cols-3 gap-1.5 lg:w-auto lg:shrink-0"
        >
          {STATUSES.map((s) => {
            const on = status === s.value;
            return (
              <Button
                key={s.value}
                type="button"
                variant="outline"
                size="sm"
                aria-pressed={on}
                onClick={() => !on && onStatus(app, s.value)}
                className={on ? s.active : ""}
              >
                {s.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Details */}
      <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
        <Detail
          icon={
            <Icon>
              <path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2ZM10 5h4v2h-4V5Z" />
            </Icon>
          }
          label="Applied for"
        >
          {app.jobTitle
            ? `${app.jobTitle}${app.company ? ` at ${app.company}` : ""}`
            : "General registration"}
        </Detail>
        <Detail
          icon={
            <Icon>
              <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.6-.6-.6-2.6 2.6-2.2Z" />
            </Icon>
          }
          label="Trade / target role"
        >
          {app.trade || "Not given"}
        </Detail>
        <Detail
          icon={
            <Icon>
              <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </Icon>
          }
          label="Preferred country"
        >
          {app.preferredCountry || app.country || "Not given"}
        </Detail>
        <Detail
          icon={
            <Icon>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </Icon>
          }
          label="Experience"
        >
          {app.experience === undefined || app.experience === ""
            ? "Not given"
            : `${app.experience} ${Number(app.experience) === 1 ? "year" : "years"}`}
        </Detail>
        <Detail
          icon={
            <Icon>
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </Icon>
          }
          label="Applied on"
        >
          {formatDate(app.appliedAt)}
        </Detail>
      </div>

      {app.coverNote && (
        <div className="mt-5 rounded-xl bg-muted/50 p-4">
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Cover note
          </p>
          <p className="whitespace-pre-line wrap-break-word text-sm leading-relaxed text-foreground/80">
            {app.coverNote}
          </p>
        </div>
      )}

      {/^https?:\/\//i.test(app.resumeUrl || "") && (
        <a
          href={app.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({
            variant: "default",
            className: "mt-5 h-10 w-full sm:w-auto",
          })}
        >
          <Icon>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6" />
          </Icon>
          <span className="truncate">
            View resume{app.resumeName && ` (${app.resumeName})`}
          </span>
        </a>
      )}
    </article>
  );
}

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "applications"),
      orderBy("appliedAt", "desc"),
    );
    return onSnapshot(
      q,
      (s) => {
        setApps(s.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Couldn't load applications. Refresh the page to try again.");
        setLoading(false);
      },
    );
  }, []);

  const jobOptions = useMemo(() => {
    const seen = new Map();
    apps.forEach((a) => {
      if (a.jobId && !seen.has(a.jobId)) {
        seen.set(
          a.jobId,
          `${a.jobTitle || "Untitled job"}${a.country ? ` (${a.country})` : ""}`,
        );
      }
    });
    return [...seen].map(([id, label]) => ({ id, label }));
  }, [apps]);

  // Job and search filters apply first, so the status tab counts match what's on screen
  const base = useMemo(() => {
    const s = search.trim().toLowerCase();
    return apps.filter((a) => {
      if (jobFilter === "none") {
        if (a.jobId) return false;
      } else if (jobFilter !== "all" && a.jobId !== jobFilter) return false;
      if (!s) return true;
      return [a.name, a.email, a.phone, a.jobTitle, a.trade].some((v) =>
        v?.toLowerCase().includes(s),
      );
    });
  }, [apps, jobFilter, search]);

  const shown =
    statusFilter === "all"
      ? base
      : base.filter((a) => statusOf(a) === statusFilter);

  const countFor = (value) =>
    value === "all"
      ? base.length
      : base.filter((a) => statusOf(a) === value).length;

  const changeStatus = async (app, status) => {
    setError(null);
    try {
      await updateDoc(doc(db, "applications", app.id), { status });
    } catch (err) {
      console.error(err);
      setError(`Couldn't update ${app.name}'s status. Try again.`);
    }
  };

  const tabs = [{ value: "all", label: "All" }, ...STATUSES];

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Applications
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review candidates, update their status and open their resumes.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Icon>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </Icon>
            </span>
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or phone"
              aria-label="Search applications"
              className="h-10 pl-9"
            />
          </div>
          <select
            className={selectCls}
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            aria-label="Filter by job"
          >
            <option value="all">All jobs</option>
            <option value="none">General registrations</option>
            {jobOptions.map((j) => (
              <option key={j.id} value={j.id}>
                {j.label}
              </option>
            ))}
          </select>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div
            role="tablist"
            aria-label="Filter by status"
            className="flex w-max gap-2 sm:w-auto sm:flex-wrap"
          >
            {tabs.map((t) => {
              const on = statusFilter === t.value;
              return (
                <Button
                  key={t.value}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  variant={on ? "default" : "outline"}
                  onClick={() => setStatusFilter(t.value)}
                  className="rounded-full"
                >
                  {t.label}
                  <span
                    className={`rounded-full px-1.5 text-xs tabular-nums ${
                      on
                        ? "bg-primary-foreground/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {countFor(t.value)}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div
          className="space-y-4"
          role="status"
          aria-label="Loading applications"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-56 rounded-2xl bg-muted motion-safe:animate-pulse"
            />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
          <p className="font-medium text-foreground">
            {apps.length === 0
              ? "No applications yet"
              : "No applications match these filters"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {apps.length === 0
              ? "New applications appear here as soon as candidates apply."
              : "Try another status, job or search term."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map((a) => (
            <ApplicationCard key={a.id} app={a} onStatus={changeStatus} />
          ))}
        </div>
      )}
    </div>
  );
}