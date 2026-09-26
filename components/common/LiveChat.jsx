"use client";
import { CircleAlert, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Field";

export function LiveChat() {
  const WHATSAPP_NUMBER = "918303022306";
  const WHATSAPP_DISPLAY = "+91 83030 22306";
  const topics = [
    "I am a job seeker looking for overseas work",
    "I am an employer and need workers",
    "I want to verify a job offer",
    "I need help with my application",
  ];
  const [topic, setTopic] = useState(topics[0]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const body = `Hello Career Dunes,\n\nTopic: ${topic}\nName: ${name || "(not provided)"}\n\n${message || "(no message added)"}`;
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 bg-primary p-5 text-primary-foreground">
        <span className="grid size-11 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground">
          <MessageCircle className="size-6" />
        </span>
        <div>
          <p className="font-display text-lg font-bold">
            Live chat with our team
          </p>
          <p className="text-xs text-primary-foreground/75">
            Message us on WhatsApp at {WHATSAPP_DISPLAY}
          </p>
        </div>
      </div>
      <div className="grid gap-4 p-6">
        <div className="rounded-md bg-muted p-4 text-sm leading-6 text-muted-foreground">
          Hi! Tell us what you need and start the chat. We reply during working
          hours.
        </div>
        <div>
          <p className="mb-2 text-sm font-bold">Choose a topic</p>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTopic(t)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${topic === t ? "border-secondary bg-secondary-soft text-secondary" : "border-border text-muted-foreground hover:border-secondary"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <Field label="Your name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            placeholder="Your full name"
          />
        </Field>
        <Field label="Your message">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            className="min-h-24"
            placeholder="Share your trade, experience or requirement"
          />
        </Field>
        <Button
          asChild
          size="lg"
          className="bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
        >
          <a href={waHref} target="_blank" rel="noreferrer" className="flex items-center gap-2">
            <MessageCircle /> Chat on WhatsApp
          </a>
        </Button>
        <Button
          type="button"
          variant="secondaryOutline"
          size="lg"
          onClick={() =>
            document
              .getElementById("contact-email-form")
              ?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
        >
          <Mail /> Message us by email
        </Button>
        <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          Chats open in WhatsApp on your device. Never share your bank PIN or
          OTP, and never pay into a personal account.
        </p>
      </div>
    </div>
  );
}
