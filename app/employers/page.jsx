import { PageHero } from "@/components/common/PageHero";
import { ReadyForm } from "@/components/common/ReadyForm";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FileCheck2, Globe2, Handshake, UsersRound } from "lucide-react";

function page() {
  return (
    <main>
      <PageHero
        eyebrow="For employers"
        title="Build reliable teams from India"
        text="Tell us the roles, project timeline and skill standards you need. We organise targeted sourcing, screening and mobilisation support."
      >
        <Button asChild variant="highlight" size="lg">
          <a href="#requirement">Share manpower requirement</a>
        </Button>
      </PageHero>
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Employer services"
            title="Structured support from brief to deployment"
          />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              [
                UsersRound,
                "Targeted sourcing",
                "Trade and location-based candidate outreach.",
              ],
              [
                FileCheck2,
                "Screening",
                "Experience, documents and basic suitability checks.",
              ],
              [
                Handshake,
                "Selection support",
                "Interview, trade test and shortlist coordination.",
              ],
              [
                Globe2,
                "Mobilisation",
                "Medical, visa, orientation and travel coordination.",
              ],
            ].map(([I, t, d]) => {
              const Icon = I;
              return (
                <article className="card p-6" key={String(t)}>
                  <Icon className="size-7 text-secondary" />
                  <h3 className="mt-4 font-bold">{String(t)}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {String(d)}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section id="requirement" className="section bg-surface">
        <div className="container grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Start a requirement"
            title="What workforce do you need?"
            text="Share your company, destination, roles, quantity and timeline. Our team will review the requirement before discussing candidates."
          />
          <div className="card p-6 md:p-8">
            <ReadyForm type="employer" />
          </div>
        </div>
      </section>
    </main>
  );
}
export default page;