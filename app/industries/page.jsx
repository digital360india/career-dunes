import { PageHero } from "@/components/common/PageHero";
import { Button } from "@/components/ui/Button";
import { BriefcaseBusiness, Building2, Car, Factory, Fuel, Hammer, Hotel, PackageCheck, PlugZap, Wrench } from "lucide-react";
import Link from "next/link";
import React from "react";

const industries = [
  { name: "Construction", icon: Building2, text: "Masons, carpenters, steel fixers, supervisors and operators." },
  { name: "Oil & Gas", icon: Fuel, text: "Fitters, riggers, welders, technicians and safety teams." },
  { name: "Manufacturing", icon: Factory, text: "Machine operators, fabricators, assemblers and quality staff." },
  { name: "Logistics", icon: PackageCheck, text: "Drivers, warehouse staff, forklift operators and coordinators." },
  { name: "Hospitality", icon: Hotel, text: "Chefs, stewards, housekeepers and guest service teams." },
  { name: "Facility Management", icon: BriefcaseBusiness, text: "MEP technicians, cleaners, security and maintenance teams." },
  { name: "Automotive", icon: Car, text: "Mechanics, electricians, painters and diagnostic technicians." },
  { name: "Electrical", icon: PlugZap, text: "Industrial, commercial and maintenance electricians." },
  { name: "Plumbing", icon: Wrench, text: "Pipe fitters, plumbers and sanitary technicians." },
  { name: "Skilled Trades", icon: Hammer, text: "Welders, fabricators, machinists and specialist trades." },
];

function page() {
  return (
    <main>
      <PageHero
        eyebrow="Industry expertise"
        title="Skilled people for essential industries"
        text="Role-focused recruitment for trades, technical teams, operations and service workforces."
      />
      <section className="section">
        <div className="container grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {industries.map(({ name, text, icon: Icon }) => (
            <article className="card p-7" key={name}>
              <Icon className="size-8 text-secondary" />
              <h2 className="mt-5 font-display text-2xl font-bold">{name}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              <Button asChild className="mt-6" variant="outline">
                <Link href="/jobs">View matching jobs</Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default page;
