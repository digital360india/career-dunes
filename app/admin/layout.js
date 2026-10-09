"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button, buttonVariants } from "@/components/ui/Button";

const links = [
  {
    href: "/admin",
    label: "Overview",
    icon: <path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" />,
  },
  {
    href: "/admin/jobs",
    label: "Job Posting",
    icon: (
      <path d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2ZM10 5h4v2h-4V5Z" />
    ),
  },
  {
    href: "/admin/applications",
    label: "Applications",
    icon: (
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-1 7V3.5L18.5 9H13Zm-5 4h8v2H8v-2Zm0 4h8v2H8v-2Z" />
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: (
      <path d="M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0Zm-4 5c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z" />
    ),
  },
];

function isActive(pathname, href) {
  // "/admin" must match exactly, otherwise it would be active on every admin page
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavLinks({ pathname, onNavigate }) {
  return (
    <nav className="space-y-1" aria-label="Admin">
      {links.map((l) => {
        const active = isActive(pathname, l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={buttonVariants({
              variant: active ? "default" : "ghost",
              className: "h-10 w-full justify-start gap-3 px-3",
            })}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {l.icon}
            </svg>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarHeader() {
  return (
    <div className="mb-6 flex items-center gap-3 px-1">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Z" />
        </svg>
      </div>
      <div className="leading-tight">
        <h2 className="text-base font-bold text-foreground">Admin</h2>
        <p className="text-xs text-muted-foreground">Manage your job board</p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) router.replace("/login");
  }, [loading, user, role, router]);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the drawer, and the page behind it stops scrolling while it's open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (loading || role !== "admin") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6" role="status">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span
            className="h-5 w-5 rounded-full border-2 border-border border-t-primary motion-safe:animate-spin"
            aria-hidden="true"
          />
          Checking access…
        </div>
      </div>
    );
  }

  const current = links.find((l) => isActive(pathname, l.href))?.label ?? "Admin";

  return (
    <div className="min-h-[80vh] bg-background lg:flex">
      {/* Mobile top bar */}
      <div className="sticky top-[70px] z-30 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="admin-drawer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
        <span className="text-base font-semibold text-foreground">{current}</span>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 self-start border-r border-border bg-muted/40 lg:sticky lg:top-[150px] lg:block lg:h-[calc(100vh-150px)] lg:overflow-y-auto">
        <div className="p-4">
          <SidebarHeader />
          <NavLinks pathname={pathname} />
          {user?.email && (
            <p className="mt-8 truncate border-t border-border px-1 pt-4 text-xs text-muted-foreground">
              Signed in as {user.email}
            </p>
          )}
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-foreground/50 transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          id="admin-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Admin menu"
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col overflow-y-auto bg-background p-4 shadow-xl transition-transform duration-200 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-2 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </Button>
          </div>
          <SidebarHeader />
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
        </aside>
      </div>

      {/* Page content */}
      <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</section>
    </div>
  );
}