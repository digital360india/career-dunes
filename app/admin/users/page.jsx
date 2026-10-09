"use client";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const roleOf = (u) => (u.role === "admin" ? "admin" : "user");

function Icon({ children, className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function initials(u) {
  const source = (u.name || u.email || "").trim();
  if (!source) return "?";
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return (parts[0][0] + (parts.length > 1 ? parts[1][0] : "")).toUpperCase();
}

function formatDate(ts) {
  const d = ts?.toDate?.();
  return d ? d.toLocaleDateString("en-GB") : "-";
}

function RoleBadge({ role }) {
  const admin = role === "admin";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        admin
          ? "bg-primary/10 text-primary ring-primary/20"
          : "bg-muted text-muted-foreground ring-border"
      }`}
    >
      {admin ? "Admin" : "User"}
    </span>
  );
}

function Avatar({ user, size = "h-10 w-10" }) {
  const admin = roleOf(user) === "admin";
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
        admin ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      }`}
      aria-hidden="true"
    >
      {initials(user)}
    </div>
  );
}

function RoleAction({ user, isMe, onChange, className = "" }) {
  if (isMe) {
    return <span className="text-xs text-muted-foreground">This is you</span>;
  }
  const toAdmin = roleOf(user) !== "admin";
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => onChange(user)}
      className={`${
        toAdmin
          ? "border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
          : ""
      } ${className}`}
    >
      {toAdmin ? "Make admin" : "Make user"}
    </Button>
  );
}

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    return onSnapshot(
      collection(db, "users"),
      (s) => {
        setUsers(s.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Couldn't load users. Refresh the page to try again.");
        setLoading(false);
      }
    );
  }, []);

  const changeRole = async (u) => {
    const next = roleOf(u) === "admin" ? "user" : "admin";
    const who = u.name || u.email || "this person";
    const msg =
      next === "admin"
        ? `Give ${who} admin access? They will be able to manage jobs, applications and other users.`
        : `Remove admin access for ${who}?`;
    if (!confirm(msg)) return;
    setError(null);
    try {
      await updateDoc(doc(db, "users", u.id), { role: next });
    } catch (err) {
      console.error(err);
      setError(`Couldn't change ${who}'s role. Try again.`);
    }
  };

  const base = useMemo(() => {
    const s = search.trim().toLowerCase();
    const list = s
      ? users.filter((u) =>
          [u.name, u.email].some((v) => v?.toLowerCase().includes(s))
        )
      : users;
    // Newest first; accounts whose timestamp hasn't resolved yet count as newest
    return [...list].sort((a, b) => {
      const ta = a.createdAt?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
      const tb = b.createdAt?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
      return tb - ta;
    });
  }, [users, search]);

  const shown =
    roleFilter === "all" ? base : base.filter((u) => roleOf(u) === roleFilter);
  const countFor = (v) =>
    v === "all" ? base.length : base.filter((u) => roleOf(u) === v).length;

  const tabs = [
    { value: "all", label: "All" },
    { value: "admin", label: "Admins" },
    { value: "user", label: "Users" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          See who has an account and decide who gets admin access.
        </p>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filter by role"
          className="flex gap-2 overflow-x-auto"
        >
          {tabs.map((t) => {
            const on = roleFilter === t.value;
            return (
              <Button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={on}
                variant={on ? "default" : "outline"}
                onClick={() => setRoleFilter(t.value)}
                className="shrink-0 rounded-full"
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 text-xs tabular-nums ${
                    on
                      ? "bg-primary-foreground/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {countFor(t.value)}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </Icon>
          </span>
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            aria-label="Search users"
            className="h-10 pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Loading users">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-muted motion-safe:animate-pulse"
            />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-12 text-center">
          <p className="font-medium text-foreground">
            {users.length === 0 ? "No users yet" : "No users match these filters"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {users.length === 0
              ? "Accounts appear here after people sign up."
              : "Try another role or search term."}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <ul className="space-y-3 md:hidden">
            {shown.map((u) => (
              <li
                key={u.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <Avatar user={u} size="h-11 w-11" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-foreground">
                        {u.name || "No name"}
                      </p>
                      <RoleBadge role={roleOf(u)} />
                    </div>
                    <p className="mt-0.5 break-all text-sm text-muted-foreground">
                      {u.email}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Joined {formatDate(u.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end border-t border-border pt-3">
                  <RoleAction
                    user={u}
                    isMe={u.id === me?.uid}
                    onChange={changeRole}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* Tablet and desktop: table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium lg:px-6">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium lg:px-6">
                    Role
                  </th>
                  <th
                    scope="col"
                    className="hidden px-4 py-3 font-medium lg:table-cell lg:px-6"
                  >
                    Joined
                  </th>
                  <th scope="col" className="px-4 py-3 lg:px-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shown.map((u) => (
                  <tr
                    key={u.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3.5 lg:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar user={u} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">
                            {u.name || "No name"}
                          </p>
                          <p className="truncate text-muted-foreground">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 lg:px-6">
                      <RoleBadge role={roleOf(u)} />
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3.5 text-muted-foreground lg:table-cell lg:px-6">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 text-right lg:px-6">
                      <RoleAction
                        user={u}
                        isMe={u.id === me?.uid}
                        onChange={changeRole}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}