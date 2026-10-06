"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

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

  const input =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-600";

  return (
    <div className="mx-auto my-16 w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold">
        {isSignup ? "Create account" : "Welcome back"}
      </h1>

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
        <button
          disabled={busy}
          className="w-full rounded-lg bg-blue-600 py-2.5 font-medium text-white disabled:opacity-60"
        >
          {busy ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
        </button>
      </form>

      <div className="my-5 text-center text-sm text-gray-400">or</div>
      <button
        onClick={() => run(googleLogin)}
        disabled={busy}
        className="w-full rounded-lg border py-2.5 font-medium hover:bg-gray-50"
      >
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-gray-600">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link className="text-blue-600" href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </div>
  );
}
