"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "About Us", href: "#about" },
  { label: "Current Jobs", href: "#jobs" },
  { label: "Countries", href: "#countries" },
  { label: "Industries", href: "#industries" },
  { label: "For Employers", href: "#employers" },
  { label: "For Job Seekers", href: "#seekers" },
  { label: "Recruitment Process", href: "#process" },
  { label: "Contact Us", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className=" bg-white fixed top-0 z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex shrink-0 items-center gap-3">
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
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium leading-tight text-slate-700 transition hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a
            href="#hire"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Hire workers
          </a>
          <a
            href="#jobs"
            className="rounded-lg bg-[#dca564] px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-[#d0954e]"
          >
            Find jobs
          </a>
        </div>

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
        <div className="border-t border-slate-300/60 px-6 pb-6 lg:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-700"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-3">
            <a
              href="#hire"
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-center text-sm font-semibold text-slate-900"
            >
              Hire workers
            </a>
            <a
              href="#jobs"
              className="rounded-lg bg-[#DCA564] px-5 py-2.5 text-center text-sm font-semibold text-slate-900"
            >
              Find jobs
            </a>
          </div>
        </div>
      )}
    </header>
  );
}