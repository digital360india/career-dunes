import { ArrowRight, Users, ShieldCheck, CheckCircle2, UserCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/heroimg.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/85 to-slate-950/30" />
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-28 lg:px-8 lg:py-36">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-[#DCA564]">
            India to the World · Ethical Overseas Recruitment
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your Trusted Partner for Overseas Workforce Solutions
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200">
            Connecting skilled Indian workers with verified international
            employers through transparent, responsible recruitment.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#jobs"
              className="inline-flex items-center gap-2 rounded-lg bg-[#DCA564] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#c68f4b]"
            >
              Find overseas jobs
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#hire"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Hire workers
              <Users className="h-4 w-4" />
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-slate-200">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#DCA564]" />
              Verified requirements
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#DCA564]" />
              Fraud-aware process
            </li>
            <li className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-[#DCA564]" />
              Candidate support
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}