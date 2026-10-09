"use client";
import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500";

const roleOf = (u) => (u.role === "admin" ? "admin" : "user");

function Icon({ children, className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
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
          ? "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20"
          : "bg-gray-100 text-gray-700 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600/40"
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
        admin
          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
      }`}
      aria-hidden="true"
    >
      {initials(user)}
    </div>
  );
}

function RoleAction({ user, isMe, onChange, className = "" }) {
  if (isMe) {
    return <span className="text-xs text-gray-500">This is you</span>;
  }
  const toAdmin = roleOf(user) !== "admin";
  return (
    <button
      type="button"
      onClick={() => onChange(user)}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
        toAdmin
          ? "border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-500/30 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
          : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      } ${className}`}
    >
      {toAdmin ? "Make admin" : "Make user"}
    </button>
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
      ? users.filter((u) => [u.name, u.email].some((v) => v?.toLowerCase().includes(s)))
      : users;
    // Newest first; accounts whose timestamp hasn't resolved yet count as newest
    return [...list].sort((a, b) => {
      const ta = a.createdAt?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
      const tb = b.createdAt?.toMillis?.() ?? Number.MAX_SAFE_INTEGER;
      return tb - ta;
    });
  }, [users, search]);

  const shown = roleFilter === "all" ? base : base.filter((u) => roleOf(u) === roleFilter);
  const countFor = (v) => (v === "all" ? base.length : base.filter((u) => roleOf(u) === v).length);

  const tabs = [
    { value: "all", label: "All" },
    { value: "admin", label: "Admins" },
    { value: "user", label: "Users" },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-3xl">Users</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          See who has an account and decide who gets admin access.
        </p>
      </header>

      {error && (
        <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Filter by role" className="flex gap-2 overflow-x-auto">
          {tabs.map((t) => {
            const on = roleFilter === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setRoleFilter(t.value)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                  on
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                {t.label}
                <span className={`rounded-full px-1.5 text-xs tabular-nums ${on ? "bg-white/20" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                  {countFor(t.value)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            aria-label="Search users"
            className={`${inputCls} pl-9`}
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Loading users">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-gray-200 motion-safe:animate-pulse dark:bg-gray-800" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-gray-50">
            {users.length === 0 ? "No users yet" : "No users match these filters"}
          </p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {users.length === 0 ? "Accounts appear here after people sign up." : "Try another role or search term."}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <ul className="space-y-3 md:hidden">
            {shown.map((u) => (
              <li key={u.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-start gap-3">
                  <Avatar user={u} size="h-11 w-11" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-gray-900 dark:text-gray-50">{u.name || "No name"}</p>
                      <RoleBadge role={roleOf(u)} />
                    </div>
                    <p className="mt-0.5 break-all text-sm text-gray-600 dark:text-gray-400">{u.email}</p>
                    <p className="mt-1 text-xs text-gray-500">Joined {formatDate(u.createdAt)}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end border-t border-gray-100 pt-3 dark:border-gray-800">
                  <RoleAction user={u} isMe={u.id === me?.uid} onChange={changeRole} />
                </div>
              </li>
            ))}
          </ul>

          {/* Tablet and desktop: table */}
          <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium lg:px-6">Name</th>
                  <th scope="col" className="px-4 py-3 font-medium lg:px-6">Role</th>
                  <th scope="col" className="hidden px-4 py-3 font-medium lg:table-cell lg:px-6">Joined</th>
                  <th scope="col" className="px-4 py-3 lg:px-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {shown.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-gray-50/70 dark:hover:bg-gray-800/40">
                    <td className="px-4 py-3.5 lg:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar user={u} />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900 dark:text-gray-50">{u.name || "No name"}</p>
                          <p className="truncate text-gray-600 dark:text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 lg:px-6"><RoleBadge role={roleOf(u)} /></td>
                    <td className="hidden whitespace-nowrap px-4 py-3.5 text-gray-600 dark:text-gray-400 lg:table-cell lg:px-6">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3.5 text-right lg:px-6">
                      <RoleAction user={u} isMe={u.id === me?.uid} onChange={changeRole} />
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