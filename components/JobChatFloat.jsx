"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  MessageCircle,
  Paperclip,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const SUGGESTIONS = [
  "I'm an electrician with 5 years experience",
  "Jobs in UAE or Qatar",
  "Which jobs need no experience?",
];

function ChatWindow({ onClose }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages([...next, { role: "assistant", text: data.reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Career Dunes job assistant"
      className="fixed inset-x-3 bottom-5 z-50 flex max-h-[min(640px,calc(100vh-8rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl sm:inset-x-auto sm:right-5 sm:w-100"
    >
      {/* Header */}
      <header className="flex items-center gap-3 bg-primary px-4 py-3 text-primary-foreground">
        <span className="grid size-9 place-items-center rounded-full bg-highlight text-primary">
          <BriefcaseBusiness className="size-5" />
        </span>
        <div className="flex-1">
          <p className="font-heading text-sm font-semibold">
            Dune · Job assistant
          </p>
          <p className="text-xs text-primary-foreground/70">
            AI suggestions from our live openings
          </p>
        </div>
        <button
          aria-label="Start over"
          onClick={() => {
            setInput("");
            setMessages([]);
          }}
          className="rounded-md p-1.5 hover:bg-primary-foreground/10"
        >
          <RotateCcw className="size-4" />
        </button>
        <button
          aria-label="Close chat"
          onClick={onClose}
          className="rounded-md p-1.5 hover:bg-primary-foreground/10"
        >
          <X className="size-4" />
        </button>
      </header>

      {/* Messages area */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
        <p className="text-foreground">
          Hi! I'm <strong>Dune</strong>, the Career Dunes job assistant. Tell me
          your trade, years of experience and preferred countries — or paste
          your CV — and I'll suggest matching overseas jobs.
        </p>

        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <p
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}
        {loading && (
          <p className="text-xs text-muted-foreground">Dune is typing…</p>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions: they just fill the input box */}
      <div className="flex flex-wrap gap-2 px-4 pb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setInput(s)}
            className="rounded-full border border-border px-3 py-1 text-xs hover:border-secondary hover:text-secondary"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={sendMessage}
        className="flex items-end gap-2 border-t border-border p-3"
      >
        <button
          type="button"
          aria-label="Attach CV"
          className="grid size-10 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
        >
          <Paperclip className="size-4" />
        </button>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) sendMessage(e);
          }}
          rows={1}
          placeholder="Type your message or paste your CV…"
          aria-label="Message"
          className="max-h-32 min-h-10 flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!input.trim() || loading}
          className="grid size-10 shrink-0 place-items-center rounded-lg bg-highlight text-primary disabled:opacity-50"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}

export default function JobChatFloat() {
  const [open, setOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const launcherRef = useRef(null);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const toggle = () => {
    setShowWelcome(false);
    setOpen((o) => !o);
  };

  return (
    <>
      {open && <ChatWindow onClose={close} />}

      {!open && (
        <aside
          aria-label="Dune job assistant"
          className="fixed bottom-24 right-3 z-40 flex w-[min(288px,calc(100vw-2rem))] flex-col items-end gap-3 sm:right-5"
        >
          {showWelcome && (
            <div className="relative w-full rounded-lg border border-border bg-card p-4 text-card-foreground shadow-xl">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Dismiss assistant welcome"
                onClick={() => setShowWelcome(false)}
                className="absolute right-1 top-1 size-8 text-muted-foreground"
              >
                <X aria-hidden="true" />
              </Button>
              <div className="mb-3 flex items-center gap-2.5 pr-5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-highlight">
                  <BriefcaseBusiness aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm font-semibold">Dune</p>
                  <p className="text-xs text-muted-foreground">
                    Your AI job assistant
                  </p>
                </div>
              </div>
              <p className="font-display text-lg font-semibold leading-snug">
                Looking for work overseas?
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Tell me your trade. Let’s find your next opportunity.
              </p>
              <Button
                variant="link"
                onClick={toggle}
                className="mt-2 h-8 px-0 text-secondary"
              >
                Let’s talk <ArrowUpRight aria-hidden="true" />
              </Button>
            </div>
          )}

          <Button
            ref={launcherRef}
            onClick={toggle}
            aria-label="Find my overseas job — chat with Dune"
            aria-haspopup="dialog"
            aria-expanded={open}
            variant="highlight"
            className="h-16 w-full justify-start gap-3 whitespace-normal rounded-full border border-highlight-strong/40 px-4 text-left shadow-xl transition-transform hover:-translate-y-0.5"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <MessageCircle aria-hidden="true" className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold">
                Find my overseas job
              </span>
              <span className="block text-xs font-medium">
                Chat with Dune · AI assistant
              </span>
            </span>
          </Button>
        </aside>
      )}
    </>
  );
}