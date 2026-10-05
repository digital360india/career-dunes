"use client";
import { PageHero } from "@/components/common/PageHero";
import { ArrowRight } from "lucide-react";
import Link from "next/link";


const countries = [
  { slug: "uae", name: "United Arab Emirates", short: "UAE", flag: "🇦🇪", roles: "Construction, logistics, hospitality", note: "Fast-growing opportunities across Dubai, Abu Dhabi and the Northern Emirates." },
  { slug: "saudi-arabia", name: "Saudi Arabia", short: "Saudi Arabia", flag: "🇸🇦", roles: "Oil & gas, infrastructure, facilities", note: "Major projects and long-term workforce demand across the Kingdom." },
  { slug: "qatar", name: "Qatar", short: "Qatar", flag: "🇶🇦", roles: "Facilities, hospitality, skilled trades", note: "Verified roles supporting infrastructure and service industries." },
  { slug: "oman", name: "Oman", short: "Oman", flag: "🇴🇲", roles: "Manufacturing, automotive, maintenance", note: "Stable opportunities with established employers across Oman." },
  { slug: "kuwait", name: "Kuwait", short: "Kuwait", flag: "🇰🇼", roles: "Oil & gas, construction, logistics", note: "Technical and trade openings with verified employers." },
  { slug: "other-destinations", name: "Other Destinations", short: "Other", flag: "🌍", roles: "Europe, Asia and international markets", note: "Selected opportunities beyond the Gulf, subject to verified demand." },
];
function page() {
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

export default page;
