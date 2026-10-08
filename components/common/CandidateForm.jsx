"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CircleAlert } from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Field";

export function CandidateForm() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId") ?? ""; // empty when not applying to a specific job
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // honeypot: pretend success for bots
    if (data.website) {
      setStatus("done");
      return;
    }

    setStatus("sending");
    try {
      // pull title/company/country from the job so the admin page can show them
      let job = {};
      if (jobId) {
        const snap = await getDoc(doc(db, "jobs", jobId)); // change if your jobs collection has another name
        if (snap.exists()) job = snap.data();
      }

      await addDoc(collection(db, "applications"), {
        // applicant
        name: data.name,
        email: data.email,
        phone: data.phone,
        experience: Number(data.experience),
        trade: data.trade,
        preferredCountry: data.country,
        coverNote: data.message,
        resumeUrl: data.cvLink,
        resumeName: "CV",
        // job
        jobId,
        jobTitle: job.title ?? "General application",
        company: job.company ?? "",
        country: job.country ?? data.country,
        // admin fields
        status: "pending",
        appliedAt: serverTimestamp(),
      });

      form.reset();
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-md border border-success/30 bg-success-soft p-6">
        <CheckCircle2 className="size-8 text-success" />
        <h3 className="mt-3 font-display text-xl font-bold">
          Your details have been received.
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Our team will review your request and contact you if there is a
          suitable match. Please use WhatsApp for immediate help.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4" aria-label="Candidate form">
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {jobId && (
        <p className="rounded-md bg-muted p-3 text-sm">
          Applying for job reference CD-{jobId.slice(0, 5).toUpperCase()}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <Input name="name" required minLength={2} maxLength={100} placeholder="Your full name" />
        </Field>
        <Field label="Email address">
          <Input name="email" required type="email" maxLength={255} placeholder="name@example.com" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mobile / WhatsApp">
          <Input
            name="phone"
            required
            inputMode="tel"
            pattern="[+0-9 -]{8,18}"
            placeholder="+91 98XXXXXXXX"
          />
        </Field>
        <Field label="Preferred country">
          <Input name="country" required maxLength={100} placeholder="e.g. UAE" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Trade / target role">
          <Input name="trade" required maxLength={100} placeholder="e.g. Electrician" />
        </Field>
        <Field label="Years of experience">
          <Input name="experience" required type="number" min="0" max="50" placeholder="3" />
        </Field>
      </div>

      <Field label="CV (PDF, DOC or DOCX — max 5 MB)">
        <Input name="cvFile" required type="file" accept=".pdf,.doc,.docx" maxLength={500} placeholder="https://drive.google.com/..." />
      </Field>

      <Field label="Additional details">
        <Textarea
          name="message"
          required
          minLength={10}
          maxLength={1000}
          className="min-h-28"
          placeholder="Share the important details"
        />
      </Field>

      <div className="flex items-start gap-2 rounded-md bg-muted p-3 text-xs leading-5 text-muted-foreground">
        <CircleAlert className="mt-0.5 size-4 shrink-0" />
        Your details will only be used to respond to this request. Never share
        your bank PIN or OTP.
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}

      <Button type="submit" size="lg" variant="highlight" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Register & submit CV"}
      </Button>
    </form>
  );
}