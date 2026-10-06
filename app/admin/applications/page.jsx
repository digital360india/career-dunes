"use client";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const q = query(
      collection(db, "applications"),
      orderBy("appliedAt", "desc"),
    );
    return onSnapshot(q, (s) =>
      setApps(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, []);

  const jobTitles = [...new Set(apps.map((a) => a.jobId))].map((id) => ({
    id,
    label:
      apps.find((a) => a.jobId === id).jobTitle +
      " (" +
      apps.find((a) => a.jobId === id).country +
      ")",
  }));
  const shown =
    filter === "all" ? apps : apps.filter((a) => a.jobId === filter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Applications ({shown.length})</h1>
        <select
          className="rounded-lg border px-3 py-2"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All jobs</option>
          {jobTitles.map((j) => (
            <option key={j.id} value={j.id}>
              {j.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {shown.map((a) => (
          <div key={a.id} className="rounded-xl border p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold">{a.name}</p>
                <p className="text-sm text-gray-600">
                  {a.email} · {a.phone}
                </p>
              </div>
              <select
                value={a.status}
                onChange={(e) =>
                  updateDoc(doc(db, "applications", a.id), {
                    status: e.target.value,
                  })
                }
                className="rounded-lg border px-3 py-1.5 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <p>
                <b>Applied for:</b> {a.jobTitle} - {a.company}
              </p>
              <p>
                <b>Country:</b> {a.country}
              </p>
              <p>
                <b>Experience:</b> {a.experience} years
              </p>
              <p>
                <b>Applied on:</b>{" "}
                {a.appliedAt?.toDate().toLocaleDateString("en-GB")}
              </p>
              {a.coverNote && (
                <p className="sm:col-span-2">
                  <b>Note:</b> {a.coverNote}
                </p>
              )}
            </div>

            <a
              href={a.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
            >
              View resume ({a.resumeName})
            </a>
          </div>
        ))}
        {!shown.length && <p className="text-gray-500">No applications yet.</p>}
      </div>
    </div>
  );
}
