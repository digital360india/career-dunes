"use client";
import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COUNTRIES } from "@/lib/countries";

const empty = {
  title: "",
  company: "",
  country: COUNTRIES[0],
  city: "",
  salary: "",
  vacancies: 1,
  type: "Full-time",
  description: "",
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract"];

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500";

function Field({ label, htmlFor, hint, className = "", children }) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

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

function formatDate(ts) {
  const d = ts?.toDate?.();
  if (!d) return "Just now";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function JobCard({ job, onToggle, onDelete }) {
  const typeStyles = {
    "Full-time":
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300",
    "Part-time": "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300",
    Contract:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  };

  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-900 sm:p-5 ${
        job.active
          ? "border-gray-200 dark:border-gray-800"
          : "border-dashed border-gray-300 dark:border-gray-700"
      }`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className={`min-w-0 flex-1 ${job.active ? "" : "opacity-60"}`}>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold text-gray-900 dark:text-gray-50 sm:text-lg">
              {job.title}
            </h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyles[job.type] || typeStyles["Full-time"]}`}
            >
              {job.type}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">
            {job.company}
          </p>

          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-1.5">
              <Icon>
                <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </Icon>
              {job.country}
              {job.city && `, ${job.city}`}
            </li>
            {job.salary && (
              <li className="flex items-center gap-1.5">
                <Icon>
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="2.5" />
                </Icon>
                {job.salary}
              </li>
            )}
            <li className="flex items-center gap-1.5">
              <Icon>
                <path d="M16 11a4 4 0 1 0-8 0M4 21c0-4 4-6 8-6s8 2 8 6" />
              </Icon>
              {job.vacancies} {job.vacancies === 1 ? "vacancy" : "vacancies"}
            </li>
            <li className="flex items-center gap-1.5 text-gray-500">
              <Icon>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </Icon>
              {formatDate(job.createdAt)}
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-gray-800 md:flex-col md:items-end md:border-0 md:pt-0 lg:flex-row lg:items-center">
          <button
            type="button"
            role="switch"
            aria-checked={!!job.active}
            onClick={() => onToggle(job)}
            className="group flex items-center gap-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <span
              className={`relative h-6 w-11 rounded-full transition-colors ${
                job.active ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  job.active ? "translate-x-5" : ""
                }`}
              />
            </span>
            <span className="w-14 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
              {job.active ? "Active" : "Hidden"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onDelete(job)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-900/60 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            <Icon>
              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" />
            </Icon>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default function AdminJobs() {
  const [form, setForm] = useState(empty);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null); // { type: "success" | "error", text }
  const [search, setSearch] = useState("");

  useEffect(() => {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    return onSnapshot(
      q,
      (s) => {
        setJobs(s.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingJobs(false);
      },
      () => {
        setLoadingJobs(false);
        setNotice({
          type: "error",
          text: "Couldn't load jobs. Refresh the page to try again.",
        });
      },
    );
  }, []);

  useEffect(() => {
    if (notice?.type !== "success") return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      await addDoc(collection(db, "jobs"), {
        ...form,
        vacancies: Math.max(1, Number(form.vacancies) || 1),
        active: true,
        createdAt: serverTimestamp(),
      });
      setForm(empty);
      setNotice({ type: "success", text: "Job posted. It's now live." });
    } catch (err) {
      console.error(err);
      setNotice({
        type: "error",
        text: "Couldn't post the job. Check your connection and try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (job) => {
    try {
      await updateDoc(doc(db, "jobs", job.id), { active: !job.active });
    } catch (err) {
      console.error(err);
      setNotice({ type: "error", text: "Couldn't update the job status." });
    }
  };

  const remove = async (job) => {
    if (!confirm(`Delete "${job.title}"? This can't be undone.`)) return;
    try {
      await deleteDoc(doc(db, "jobs", job.id));
    } catch (err) {
      console.error(err);
      setNotice({ type: "error", text: "Couldn't delete the job." });
    }
  };

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return jobs;
    return jobs.filter((j) =>
      [j.title, j.company, j.country, j.city].some((v) =>
        v?.toLowerCase().includes(s),
      ),
    );
  }, [jobs, search]);

  const activeCount = jobs.filter((j) => j.active).length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 lg:space-y-12">
      {/* Post form */}
      <section aria-labelledby="post-heading">
        <header className="mb-5">
          <h1
            id="post-heading"
            className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl"
          >
            Post a new job
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Fill in the details below. The job goes live as soon as you post it.
          </p>
        </header>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6 lg:p-8"
        >
          <div className="space-y-8">
            <fieldset>
              <legend className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-50">
                Role
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Job title" htmlFor="title">
                  <input
                    id="title"
                    className={inputCls}
                    placeholder="e.g. Site Electrician"
                    required
                    value={form.title}
                    onChange={set("title")}
                  />
                </Field>
                <Field label="Company or employer" htmlFor="company">
                  <input
                    id="company"
                    className={inputCls}
                    placeholder="e.g. Al Noor Construction"
                    required
                    value={form.company}
                    onChange={set("company")}
                  />
                </Field>
                <Field label="Job type" htmlFor="type">
                  <select
                    id="type"
                    className={inputCls}
                    value={form.type}
                    onChange={set("type")}
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Vacancies"
                  htmlFor="vacancies"
                  hint="How many people you want to hire."
                >
                  <input
                    id="vacancies"
                    className={inputCls}
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={form.vacancies}
                    onChange={set("vacancies")}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-50">
                Location and pay
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Country" htmlFor="country">
                  <select
                    id="country"
                    className={inputCls}
                    value={form.country}
                    onChange={set("country")}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="City" htmlFor="city">
                  <input
                    id="city"
                    className={inputCls}
                    placeholder="e.g. Dubai"
                    value={form.city}
                    onChange={set("city")}
                  />
                </Field>
                <Field
                  label="Salary"
                  htmlFor="salary"
                  className="sm:col-span-2"
                  hint="Include the currency and period."
                >
                  <input
                    id="salary"
                    className={inputCls}
                    placeholder="e.g. AED 2000/month"
                    value={form.salary}
                    onChange={set("salary")}
                  />
                </Field>
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-50">
                Description
              </legend>
              <Field
                label="Job description and requirements"
                htmlFor="description"
              >
                <textarea
                  id="description"
                  className={`${inputCls} resize-y`}
                  rows={6}
                  placeholder="What will the person do? What skills, experience or documents do they need?"
                  required
                  value={form.description}
                  onChange={set("description")}
                />
              </Field>
            </fieldset>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <div
              role="status"
              aria-live="polite"
              className="min-h-[1.25rem] text-sm"
            >
              {notice && (
                <span
                  className={
                    notice.type === "success"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }
                >
                  {notice.text}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setForm(empty)}
                disabled={busy}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Clear form
              </button>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {busy && (
                  <span
                    className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin"
                    aria-hidden="true"
                  />
                )}
                {busy ? "Posting" : "Post job"}
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Job list */}
      <section aria-labelledby="jobs-heading">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="jobs-heading"
              className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-2xl"
            >
              All jobs
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {jobs.length} total, {activeCount} active
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Icon>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </Icon>
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, company or place"
              aria-label="Search jobs"
              className={`${inputCls} pl-9`}
            />
          </div>
        </div>

        {loadingJobs ? (
          <div className="space-y-3" role="status" aria-label="Loading jobs">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-gray-200 motion-safe:animate-pulse dark:bg-gray-800"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-gray-50">
              {jobs.length === 0 ? "No jobs yet" : "No jobs match your search"}
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {jobs.length === 0
                ? "Post your first job using the form above."
                : "Try a different title, company or place."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((j) => (
              <JobCard key={j.id} job={j} onToggle={toggle} onDelete={remove} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
