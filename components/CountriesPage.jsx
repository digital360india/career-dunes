import Link from "next/link";
import { PageHero } from "./common/PageHero";

export function CountriesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Destinations"
        title="Explore overseas jobs by country"
        text="Country guidance, priority sectors and verified opportunities for skilled Indian workers."
      />
      <section className="section">
        <div className="container grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {countries.map((c) => (
            <Link
              key={c.slug}
              href={`/countries/${c.slug}`}
              className="card p-7"
            >
              <span className="text-4xl">{c.flag}</span>
              <h2 className="mt-4 font-display text-2xl font-bold">{c.name}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{c.note}</p>
              <p className="mt-5 text-sm font-bold text-secondary">{c.roles}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                View country guide <ArrowRight className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
