"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/jobs", label: "Job Posting" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminLayout({ children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) router.replace("/login");
  }, [loading, user, role, router]);

  if (loading || role !== "admin") return <p className="p-10">Checking access...</p>;

  return (
    <div className="flex min-h-[80vh]">
      <aside className="w-56 shrink-0 border-r bg-gray-50 p-4">
        <h2 className="mb-4 text-lg font-bold">Admin</h2>
        <nav className="space-y-1">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className={`block rounded-lg px-3 py-2 text-sm ${
                pathname === l.href ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`}>
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="flex-1 p-6">{children}</section>
    </div>
  );
}