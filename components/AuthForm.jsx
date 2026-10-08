"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Briefcase, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { Button } from "./ui/Button";


export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const { login, signup, googleLogin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const go = (role) => router.push(role === "admin" ? "/admin" : "/");

  const run = async (fn) => {
    setError("");
    setBusy(true);
    try {
      go(await fn());
    } catch (e) {
      setError(e.message.replace("Firebase: ", ""));
    } finally {
      setBusy(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    run(() =>
      isSignup
        ? signup(form.name, form.email, form.password)
        : login(form.email, form.password),
    );
  };

  const heading = {
    signup: { title: "Create team account", text: "Set up an account to access the Career Dunes team area." },
    login: { title: "Welcome back", text: "Sign in to your Career Dunes team account." },
    forgot: { title: "Reset your password", text: "Enter your team email and we will send a secure reset link." },
    reset: { title: "Set a new password", text: "Choose a new password for your account." },
  }[mode]

  const input =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-600";

  return (
    <section className="bg-primary py-10 text-primary-foreground md:py-15">
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="grid gap-6">
          <span className="inline-flex w-fit items-center gap-2 text-xs font-bold uppercase text-highlight">
            <ShieldCheck aria-hidden="true" className="size-4" /> Team access
          </span>
          <h1 className="font-heading text-4xl font-extrabold leading-tight md:text-5xl">
            Career Dunes team access
          </h1>
          <p className="max-w-md leading-relaxed text-primary-foreground/80">
            Secure access for the Career Dunes team to publish and update
            overseas job openings.
          </p>
          <ul className="grid gap-3 text-sm text-primary-foreground/85">
            <li className="flex items-center gap-3">
              <Briefcase aria-hidden="true" className="size-4 text-highlight" />{" "}
              Manage live job listings
            </li>
            <li className="flex items-center gap-3">
              <Lock aria-hidden="true" className="size-4 text-highlight" />{" "}
              Protected team access
            </li>
            <li className="flex items-center gap-3">
              <KeyRound aria-hidden="true" className="size-4 text-highlight" />{" "}
              Secure password reset by email
            </li>
          </ul>
        </div>
        <div className="mx-auto my-16 w-full max-w-md rounded-2xl border card grid min-w-0 gap-5 border-border bg-card p-6 text-card-foreground shadow-xl md:p-8">
          {/* <h1 className="mb-6 text-2xl font-bold">
            {isSignup ? "Create account" : "Welcome back"}
          </h1> */}
          <div className="grid gap-1">
            <h2 className="font-heading text-2xl font-bold">{heading.title}</h2>
            <p className="text-sm text-muted-foreground">{heading.text}</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {isSignup && (
              <input
                className={input}
                placeholder="Full name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            )}
            <input
              className={input}
              type="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className={input}
              type="password"
              placeholder="Password (min 6 characters)"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              disabled={busy}
              variant="highlight"
              className="w-full rounded-lg py-2.5 font-medium text-white disabled:opacity-60"
            >
              {busy ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
            </Button>
          </form>

          {/* <div className="my-5 text-center text-sm text-gray-400">or</div> */}
          <button
            onClick={() => run(googleLogin)}
            disabled={busy}
            className="w-full rounded-lg border py-2.5 font-medium hover:bg-gray-50"
          >
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            {isSignup ? "Already have an account? " : "New here? "}
            <Link
              className="text-blue-600"
              href={isSignup ? "/login" : "/signup"}
            >
              {isSignup ? "Log in" : "Sign up"}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
