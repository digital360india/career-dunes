"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const snap = await getDoc(doc(db, "jobs", id));
        if (cancelled) return;

        if (snap.exists() && snap.data().active !== false) {
          setJob({ docId: snap.id, ...snap.data() });
          console.log("Job found:", snap.data());
          setStatus("found");
        } else {
          setStatus("missing");
        }
      } catch {
        if (!cancelled) setStatus("missing");
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  if (status === "loading") return <p className="container py-16">Loading…</p>;

  if (status === "missing")
    return (
      <div className="container py-16">
        <p className="font-bold">Job not found.</p>
        <Link href="/jobs" className="text-secondary underline">Back to all jobs</Link>
      </div>
    );

  return (
    <main className="container py-12">
      <Link href="/jobs" className="text-sm text-muted-foreground"> &larr; All jobs</Link>
      <h1 className="mt-4 font-display text-3xl font-bold">{job.title}</h1>
      <p className="mt-2 text-muted-foreground">
        {[job.city, job.country].filter(Boolean).join(", ")}
        {job.company ? ` · ${job.company}` : ""}
      </p>

      <dl className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-4 text-sm">
        <div><dt className="text-xs text-muted-foreground">Salary</dt><dd className="font-bold">{job.salary}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Vacancies</dt><dd className="font-bold">{job.vacancies}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Type</dt><dd className="font-bold">{job.type}</dd></div>
      </dl>

      <div className="mt-6 whitespace-pre-line leading-7">{job.description}</div>

      <Button asChild className="mt-8">
        <Link href="/seekers">Register your CV</Link>
      </Button>
    </main>
  );
}