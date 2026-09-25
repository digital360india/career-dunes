import { ShieldAlert } from "lucide-react";

const QUICK_LINKS = [
  { label: "About us", href: "#about" },
  { label: "Current jobs", href: "#jobs" },
  { label: "For employers", href: "#employers" },
  { label: "Contact us", href: "#contact" },
];

const COUNTRIES = [
  { label: "UAE", href: "#uae" },
  { label: "Saudi Arabia", href: "#saudi-arabia" },
  { label: "Qatar", href: "#qatar" },
  { label: "Oman", href: "#oman" },
  { label: "Kuwait", href: "#kuwait" },
];

const INDUSTRIES = [
  { label: "Construction", href: "#construction" },
  { label: "Oil & Gas", href: "#oil-gas" },
  { label: "Manufacturing", href: "#manufacturing" },
  { label: "Logistics", href: "#logistics" },
  { label: "Hospitality", href: "#hospitality" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Terms & Conditions", href: "#terms" },
  { label: "Disclaimer", href: "#disclaimer" },
  { label: "Team sign in", href: "#sign-in" },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-xs font-bold tracking-widest text-[#dca564]">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-slate-300 transition hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className=" bg-[#1B2431]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <span className="inline-block rounded-lg bg-[#faf7f2] px-5 py-3 text-xl font-extrabold text-slate-900">
              Career Dunes
            </span>

            <p className="mt-6 max-w-xs text-sm leading-relaxed text-slate-300">
              Connecting skilled Indian workers with verified international
              employers through clear, ethical and candidate-first
              recruitment.
            </p>

            <a
              href="#report-fraud"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#dca564] transition hover:text-[#e8b87a]"
            >
              <ShieldAlert className="h-4 w-4" />
              Verify job / report fraud
            </a>
          </div>

          <FooterColumn title="QUICK LINKS" links={QUICK_LINKS} />
          <FooterColumn title="JOBS BY COUNTRY" links={COUNTRIES} />
          <FooterColumn title="INDUSTRIES" links={INDUSTRIES} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-slate-400 sm:flex-row lg:px-8">
          <p>© 2026 Career Dunes. All rights reserved.</p>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}