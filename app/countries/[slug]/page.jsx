"use client";
import { PageHero } from "@/components/common/PageHero";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const countries = [
  { slug: "uae", name: "United Arab Emirates", short: "UAE", flag: "🇦🇪", roles: "Construction, logistics, hospitality", note: "Fast-growing opportunities across Dubai, Abu Dhabi and the Northern Emirates." },
  { slug: "saudi-arabia", name: "Saudi Arabia", short: "Saudi Arabia", flag: "🇸🇦", roles: "Oil & gas, infrastructure, facilities", note: "Major projects and long-term workforce demand across the Kingdom." },
  { slug: "qatar", name: "Qatar", short: "Qatar", flag: "🇶🇦", roles: "Facilities, hospitality, skilled trades", note: "Verified roles supporting infrastructure and service industries." },
  { slug: "oman", name: "Oman", short: "Oman", flag: "🇴🇲", roles: "Manufacturing, automotive, maintenance", note: "Stable opportunities with established employers across Oman." },
  { slug: "kuwait", name: "Kuwait", short: "Kuwait", flag: "🇰🇼", roles: "Oil & gas, construction, logistics", note: "Technical and trade openings with verified employers." },
  { slug: "other-destinations", name: "Other Destinations", short: "Other", flag: "🌍", roles: "Europe, Asia and international markets", note: "Selected opportunities beyond the Gulf, subject to verified demand." },
];

function page() {
  const { slug } = useParams({ from: "/countries/$slug" });
  const c = countries.find((x) => x.slug === slug) ?? countries[0];
  if (!c) return null;
  return (
    <main>
      <PageHero
        eyebrow="Country guide"
        title={`Overseas jobs in ${c.name}`}
        text={c.note}
      >
        <Button asChild variant="highlight" size="lg">
          <Link href="/jobs">See current jobs</Link>
        </Button>
      </PageHero>
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <SectionHeading
              title={`Working in ${c.short}`}
              text={`Career Dunes supports suitable candidates through screening, employer interviews, documentation and mobilisation for verified roles in ${c.name}.`}
            />
            <h3 className="font-display text-2xl font-bold">
              Priority sectors
            </h3>
            <p className="mt-3 text-muted-foreground">{c.roles}</p>
            <h3 className="mt-9 font-display text-2xl font-bold">
              Before you accept
            </h3>
            <ul className="mt-5 space-y-3">
              {[
                "Check the job reference and employer details.",
                "Read salary, duty hours, accommodation and benefits.",
                "Keep copies of your contract, visa and payment receipts.",
                "Never pay into a personal bank account.",
              ].map((x) => (
                <li className="flex gap-3" key={x}>
                  <CheckCircle2 className="size-5 shrink-0 text-success" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <aside className="rounded-md bg-muted p-6">
            <ShieldCheck className="size-8 text-secondary" />
            <h2 className="mt-4 font-display text-2xl font-bold">
              Verify this opportunity
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Received an offer for {c.name}? Check it with Career Dunes before
              making any payment.
            </p>
            <Button asChild className="mt-6 w-full" variant="highlight">
              <Link href="/verify-job">Verify job offer</Link>
            </Button>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default page;