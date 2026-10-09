"use client";
import { useCallback, useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

const STATS = [
  {
    key: "jobs",
    label: "Jobs",
    hint: "Listings posted",
    accent: "bg-indigo-500",
    iconWrap: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300",
    icon: (
      <path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2ZM10 5h4v2h-4V5Z" />
    ),
  },
  {
    key: "users",
    label: "Users",
    hint: "Registered accounts",
    accent: "bg-emerald-500",
    iconWrap: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    icon: (
      <path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm-4 5c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z" />
    ),
  },
  {
    key: "applications",
    label: "Applications",
    hint: "Submitted by candidates",
    accent: "bg-amber-500",
    iconWrap: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    icon: (
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-1 7V3.5L18.5 9H13Zm-5 4h8v2H8v-2Zm0 4h8v2H8v-2Z" />
    ),
  },
];

const nf = new Intl.NumberFormat("en-US");

function StatCard({ stat, value, loading }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <span className={`absolute inset-y-0 left-0 w-1 ${stat.accent}`} aria-hidden="true" />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>

          {loading ? (
            <div className="mt-3 h-9 w-24 rounded-md bg-gray-200 motion-safe:animate-pulse dark:bg-gray-800 sm:h-10" />
          ) : (
            <p className="mt-2 truncate text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              {nf.format(value)}
            </p>
          )}

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">{stat.hint}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconWrap}`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            {stat.icon}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const [counts, setCounts] = useState({ jobs: 0, users: 0, applications: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all counts in parallel instead of one after another
      const entries = await Promise.all(
        STATS.map(async ({ key }) => {
          const snap = await getCountFromServer(collection(db, key));
          return [key, snap.data().count];
        })
      );
      setCounts(Object.fromEntries(entries));
    } catch (e) {
      console.error(e);
      setError("We couldn't load the latest numbers. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const appsPerJob = counts.jobs > 0 ? (counts.applications / counts.jobs).toFixed(1) : "0";

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl">
            Overview
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            A snapshot of your job board right now.
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 sm:w-auto"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 ${loading ? "motion-safe:animate-spin" : ""}`}
            aria-hidden="true"
          >
            <path d="M21 12a9 9 0 1 1-3-6.7" />
            <path d="M21 4v5h-5" />
          </svg>
          {loading ? "Refreshing" : "Refresh"}
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={load}
            className="self-start rounded-md bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:self-auto"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" aria-live="polite">
        {STATS.map((stat) => (
          <StatCard key={stat.key} stat={stat} value={counts[stat.key]} loading={loading} />
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:mt-6 sm:p-6">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Applications per job</p>
        {loading ? (
          <div className="mt-3 h-8 w-16 rounded-md bg-gray-200 motion-safe:animate-pulse dark:bg-gray-800" />
        ) : (
          <p className="mt-2 text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-50">
            {appsPerJob}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500">Average across all listings.</p>
      </div>
    </section>
  );
}