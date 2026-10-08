"use client";

import { useState } from "react";
import { ChevronDown, Menu, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const menuGroups = [
  {
    label: "Home",
    href: "/",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Recruitment Process", href: "/process" },
    ],
  },
  {
    label: "Current Jobs",
    href: "/jobs",
    items: [
      { label: "All Jobs", href: "/jobs" },
      { label: "Jobs by Country", href: "/countries" },
      { label: "For Job Seekers", href: "/seekers" },
    ],
  },
  {
    label: "Employers",
    href: "/employers",
    items: [
      { label: "For Employers", href: "/employers" },
      { label: "Industries", href: "/industries" },
      { label: "Recruitment Process", href: "/process" },
    ],
  },
  {
    label: "Contact Us",
    href: "/contact",
    items: [
      { label: "Contact Us", href: "/contact" },
      { label: "Verify a Job", href: "/verify-job" },
    ],
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading, logout } = useAuth();
  const isActive = (href) => pathname === href;

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/");
  };

  return (
    <header className=" bg-white sticky top-0 z-50 w-full">
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-9 items-center justify-between gap-4 text-xs font-medium">
          <p className="hidden items-center gap-2 sm:flex">
            <ShieldCheck className="size-3.5 text-highlight" /> Verified
            employers. Transparent recruitment.
          </p>
          <Link
            href="/verify-job"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-semibold hover:text-highlight"
          >
            Verify a job offer →
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
            CD
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold text-slate-900">
              Career Dunes
            </span>
            <span className="block text-[10px] font-semibold tracking-widest text-slate-500">
              OVERSEAS
              <br />
              RECRUITMENT
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {menuGroups.map((group) => (
            <div key={group.label} className="group relative">
              <Link
                href={group.href}
                className={`flex h-18 items-center gap-1.5 px-3 text-sm font-semibold transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive(group.href)
                    ? "text-secondary"
                    : "text-muted-foreground"
                }`}
              >
                {group.label}
                <ChevronDown
                  aria-hidden="true"
                  className="size-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 min-w-56 translate-y-1 border border-border bg-popover p-2 opacity-0 shadow-lg transition-[opacity,transform,visibility] duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block rounded-sm px-3 py-2.5 text-sm transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:outline-none ${
                      isActive(item.href)
                        ? "font-semibold text-secondary"
                        : "text-popover-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Auth buttons (desktop) */}
          {!loading &&
            (user ? (
              <div className="ml-3 flex items-center gap-2">
                {role === "admin" && (
                  <Button asChild variant="highlight" size="lg">
                    <Link href="/admin">Dashboard</Link>
                  </Button>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="ml-3 flex items-center gap-2">
                {/* <Link
                  href="/login"
                  className="px-3 text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  Login
                </Link> */}
                <Button asChild variant="highlight" size="lg">
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-900 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="fixed inset-0 z-60 min-h-screen overflow-y-auto bg-primary text-primary-foreground lg:hidden">
          <div className="container grid h-18 grid-cols-[minmax(0,1fr)_auto] items-center">
            <span className="font-display text-xl font-bold">Career Dunes</span>
            <Button
              variant="nav"
              size="icon"
              className="min-h-11 min-w-11"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
          </div>
          <nav className="container grid pt-4" aria-label="Mobile navigation">
            {menuGroups.map((group, index) => (
              <div
                key={group.label}
                className="border-b border-primary-foreground/15"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center">
                  <Link
                    href={group.href}
                    onClick={() => setOpen(false)}
                    className="flex min-w-0 items-center gap-4 py-4 text-xl"
                  >
                    <span className="text-xs text-highlight">0{index + 1}</span>
                    {group.label}
                  </Link>
                  <Button
                    variant="nav"
                    size="icon"
                    className="min-h-11 min-w-11"
                    aria-label={`${expanded === group.label ? "Close" : "Open"} ${group.label} links`}
                    aria-expanded={expanded === group.label}
                    aria-controls={`mobile-menu-${index}`}
                    onClick={() =>
                      setExpanded(expanded === group.label ? null : group.label)
                    }
                  >
                    <ChevronDown
                      className={`size-5 transition-transform duration-200 ${expanded === group.label ? "rotate-180" : ""}`}
                    />
                  </Button>
                </div>
                {expanded === group.label && (
                  <div
                    id={`mobile-menu-${index}`}
                    className="grid gap-1 pb-4 pl-9"
                  >
                    {group.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="py-2 text-base text-primary-foreground/80 hover:text-primary-foreground"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Auth buttons (mobile) */}
            {!loading &&
              (user ? (
                <div className="mt-6 grid gap-3 pb-10">
                  {role === "admin" && (
                    <Button
                      asChild
                      variant="highlight"
                      size="lg"
                      className="w-full"
                    >
                      <Link href="/admin" onClick={() => setOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-md border border-primary-foreground/30 py-3 text-base font-semibold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mt-6 grid gap-3 pb-10">
                  <Button
                    asChild
                    variant="highlight"
                    size="lg"
                    className="w-full"
                  >
                    <Link href="/signup" onClick={() => setOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                  {/* <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="w-full rounded-md border border-primary-foreground/30 py-3 text-center text-base font-semibold"
                  >
                    Login
                  </Link> */}
                </div>
              ))}
          </nav>
        </div>
      )}
    </header>
  );
}
