"use client";
import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Overview() {
  const [counts, setCounts] = useState({ jobs: 0, users: 0, applications: 0 });

  useEffect(() => {
    (async () => {
      const out = {};
      for (const k of ["jobs", "users", "applications"]) {
        out[k] = (await getCountFromServer(collection(db, k))).data().count;
      }
      setCounts(out);
    })();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} className="rounded-xl border p-6">
            <p className="text-sm capitalize text-gray-500">{k}</p>
            <p className="text-3xl font-bold">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}