const STATS = [
  { value: "15+", label: "Markets supported" },
  { value: "10", label: "Core industries" },
  { value: "6", label: "Priority destinations" },
  { value: "100%", label: "Offer verification" },
];

export default function StatsBar() {
  return (
    <section className="bg-[#faf7f2] py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-y divide-slate-300/70 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          {STATS.map((stat) => (
            <div key={stat.label} className="px-4 py-6 text-center first:pl-0 sm:py-0">
              <p className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Representative service coverage. Placement totals will be published
          after verification.
        </p>
      </div>
    </section>
  );
}