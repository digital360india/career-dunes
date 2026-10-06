"use client";
import { useEffect, useState } from "react";
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COUNTRIES } from "@/lib/countries";

const empty = {
  title: "", company: "", country: COUNTRIES[0], city: "",
  salary: "", vacancies: 1, type: "Full-time", description: "",
};

export default function AdminJobs() {
  const [form, setForm] = useState(empty);
  const [jobs, setJobs] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (s) => setJobs(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    await addDoc(collection(db, "jobs"), {
      ...form,
      vacancies: Number(form.vacancies),
      active: true,
      createdAt: serverTimestamp(),
    });
    setForm(empty);
    setBusy(false);
  };

  const input = "w-full rounded-lg border px-3 py-2";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-4 text-2xl font-bold">Post a new job</h1>
        <form onSubmit={submit} className="grid max-w-3xl gap-4 sm:grid-cols-2">
          <input className={input} placeholder="Job title" required value={form.title} onChange={set("title")} />
          <input className={input} placeholder="Company / Employer" required value={form.company} onChange={set("company")} />
          <select className={input} value={form.country} onChange={set("country")}>
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input className={input} placeholder="City" value={form.city} onChange={set("city")} />
          <input className={input} placeholder="Salary (e.g. AED 2000/month)" value={form.salary} onChange={set("salary")} />
          <input className={input} type="number" min="1" placeholder="Vacancies" value={form.vacancies} onChange={set("vacancies")} />
          <select className={input} value={form.type} onChange={set("type")}>
            <option>Full-time</option><option>Part-time</option><option>Contract</option>
          </select>
          <textarea className={`${input} sm:col-span-2`} rows={5} placeholder="Job description & requirements"
            required value={form.description} onChange={set("description")} />
          <button disabled={busy} className="rounded-lg bg-blue-600 px-5 py-2.5 text-white sm:col-span-2 sm:w-fit">
            {busy ? "Posting..." : "Post job"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold">All jobs ({jobs.length})</h2>
        <div className="space-y-3">
          {jobs.map((j) => (
            <div key={j.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
              <div>
                <p className="font-semibold">{j.title} <span className="text-gray-500">- {j.company}</span></p>
                <p className="text-sm text-gray-500">{j.country}{j.city && `, ${j.city}`} · {j.salary} · {j.vacancies} vacancies</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateDoc(doc(db, "jobs", j.id), { active: !j.active })}
                  className={`rounded-lg px-3 py-1.5 text-sm ${j.active ? "bg-green-100 text-green-700" : "bg-gray-200"}`}>
                  {j.active ? "Active" : "Hidden"}
                </button>
                <button onClick={() => confirm("Delete this job?") && deleteDoc(doc(db, "jobs", j.id))}
                  className="rounded-lg bg-red-100 px-3 py-1.5 text-sm text-red-700">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}