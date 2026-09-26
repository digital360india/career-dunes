'use client';
import { CheckCircle2, CircleAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Field";
export function ReadyForm({ type = "candidate" }) {
  const [done, setDone] = useState(false);
  function submit(e) {
    e.preventDefault();
    setDone(true);
  }
  if (done)
    return (
      <div className="rounded-md border border-success/30 bg-success-soft p-6">
        <CheckCircle2 className="size-8 text-success" />
        <h3 className="mt-3 font-display text-xl font-bold">
          Your details have been checked.
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Email delivery is awaiting Career Dunes’ verified sender domain and
          inbox. Please use WhatsApp for immediate help.
        </p>
      </div>
    );
  return (
    <form onSubmit={submit} className="grid gap-4" aria-label={`${type} form`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name">
          <Input
            required
            minLength={2}
            maxLength={100}
            placeholder="Your full name"
          />
        </Field>
        <Field label={type === "employer" ? "Company email" : "Email address"}>
          <Input
            required
            type="email"
            maxLength={255}
            placeholder="name@example.com"
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mobile / WhatsApp">
          <Input
            required
            inputMode="tel"
            pattern="[+0-9 -]{8,18}"
            placeholder="+91 98XXXXXXXX"
          />
        </Field>
        <Field
          label={type === "employer" ? "Company name" : "Preferred country"}
        >
          <Input
            required
            maxLength={100}
            placeholder={type === "employer" ? "Your company" : "e.g. UAE"}
          />
        </Field>
      </div>
      {type === "candidate" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Trade / target role">
              <Input required maxLength={100} placeholder="e.g. Electrician" />
            </Field>
            <Field label="Years of experience">
              <Input required type="number" min="0" max="50" placeholder="3" />
            </Field>
          </div>
          <Field label="CV (PDF, DOC or DOCX — max 5 MB)">
            <Input required type="file" accept=".pdf,.doc,.docx" />
          </Field>
        </>
      )}
      {type === "employer" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Roles needed">
            <Input
              required
              maxLength={200}
              placeholder="e.g. 25 pipe fitters"
            />
          </Field>
          <Field label="Hiring timeline">
            <Input required maxLength={100} placeholder="e.g. Within 45 days" />
          </Field>
        </div>
      )}
      {type === "verify" && (
        <Field label="Job reference / recruiter details">
          <Input
            required
            maxLength={150}
            placeholder="Reference number, phone or company"
          />
        </Field>
      )}
      <Field
        label={type === "contact" ? "How can we help?" : "Additional details"}
      >
        <Textarea
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
      <Button type="submit" size="lg" variant="highlight">
        {type === "candidate"
          ? "Register & submit CV"
          : type === "employer"
            ? "Submit manpower requirement"
            : type === "verify"
              ? "Request verification"
              : "Send enquiry"}
      </Button>
    </form>
  );
}
