'use client';

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/Button"
import { CheckCircle2, X } from "lucide-react";
import { Field } from "./ui/Field";
import { Input } from "./ui/Input";

export function QuickJobSeekerForm({ compact = false }) {
  const [done, setDone] = useState(false);
  function submit(e) {
    e.preventDefault();
    setDone(true);
  }
  if (done)
    return (
      <div className="rounded-md border border-success/30 bg-success-soft p-5 text-success">
        <CheckCircle2 className="size-7" />
        <p className="mt-2 font-bold text-foreground">
          Thank you. Your job interest is recorded.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Our team will contact you once form delivery is activated.
        </p>
      </div>
    );
  return (
    <form
      onSubmit={submit}
      className={compact ? "grid gap-3" : "grid gap-4 md:grid-cols-2"}
      aria-label="Quick job seeker registration"
    >
      <Field label="Full name">
        <Input
          required
          minLength={2}
          maxLength={100}
          placeholder="Your full name"
        />
      </Field>
      <Field label="Mobile / WhatsApp">
        <Input
          required
          inputMode="tel"
          pattern="[+0-9 -]{8,18}"
          placeholder="+91 98XXXXXXXX"
        />
      </Field>
      <Field label="Trade / target role">
        <Input required maxLength={100} placeholder="e.g. Electrician" />
      </Field>
      <Field label="Preferred country">
        <Input required maxLength={100} placeholder="e.g. UAE" />
      </Field>
      <label
        className={
          compact
            ? "flex items-start gap-2 text-xs leading-5 text-muted-foreground"
            : "flex items-start gap-2 text-xs leading-5 text-muted-foreground md:col-span-2"
        }
      >
        <input
          required
          type="checkbox"
          className="mt-1 size-4 accent-primary"
        />
        I agree to be contacted about suitable overseas job opportunities.
      </label>
      <Button
        type="submit"
        size="lg"
        variant="highlight"
        className={compact ? "w-full" : "md:col-span-2 md:w-fit"}
      >
        Register interest <ArrowRight />
      </Button>
    </form>
  );
}

export function JobSeekerPopup() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("career-dunes-job-popup-dismissed")) return;
    const timer = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [open]);
  function dismiss() {
    sessionStorage.setItem("career-dunes-job-popup-dismissed", "true");
    setOpen(false);
  }
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-70 grid place-items-center bg-primary/75 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) dismiss();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-popup-title"
        className="relative max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-md bg-card p-6 shadow-2xl sm:p-8"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3"
          onClick={dismiss}
          aria-label="Close job seeker form"
        >
          <X />
        </Button>
        <p className="eyebrow text-secondary">Overseas job seeker</p>
        <h2
          id="job-popup-title"
          className="mt-2 pr-10 font-display text-2xl font-bold text-foreground"
        >
          Find your next verified opportunity
        </h2>
        <p className="mt-3 mb-6 text-sm leading-6 text-muted-foreground">
          Register your interest and our team will match your profile with
          suitable vacancies.
        </p>
        <QuickJobSeekerForm compact />
        <Button
          type="button"
          onClick={dismiss}
          variant="link"
          size="sm"
          className="mt-3 w-full text-muted-foreground"
        >
          Not now
        </Button>
      </section>
    </div>
  );
}
