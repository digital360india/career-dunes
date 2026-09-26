import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "./common/SectionHeading";
import { FraudBand } from "./common/FraudBand";
import { PageHero } from "./common/PageHero";
// import teamImage from "@/assets/career-dunes-team.jpg";

export function AboutPage() {
  const whatWeDo = [
    "Gulf recruitment and manpower placement",
    "Skilled and semi-skilled workforce sourcing",
    "Candidate screening and shortlisting",
    "Employer-specific recruitment",
    "Interview and selection coordination",
    "Recruitment and documentation support",
    "Pre-departure guidance",
  ];
  return (
    <main>
      <PageHero
        eyebrow="About Career Dunes"
        title="Connecting Skilled Talent with Opportunities Across the Gulf"
        text="An India-based blue-collar recruitment and placement agency serving employers and job seekers across the Gulf region."
      />
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Who we are" title="About Career Dunes" />
            <p className="leading-8 text-muted-foreground">
              Career Dunes is an India-based blue-collar recruitment and
              placement agency connecting skilled, semi-skilled, and experienced
              Indian professionals with employment opportunities across the Gulf
              region.
            </p>
            <p className="mt-4 leading-8 text-muted-foreground">
              We work with employers to understand their workforce requirements
              and help identify suitable candidates across sectors such as
              construction, hospitality, facility management, logistics,
              manufacturing, maintenance, and other essential services.
            </p>
            <p className="mt-4 leading-8 text-muted-foreground">
              For candidates, we aim to make the overseas recruitment journey
              clear, structured, and professional—from understanding job
              opportunities and eligibility requirements to supporting them
              through the recruitment and documentation process.
            </p>
          </div>
          <img
            loading="lazy"
            src='career-dunes-team.jpg'
            width={1408}
            height={1008}
            className="rounded-md"
            alt="Career Dunes recruitment team reviewing an overseas project"
          />
        </div>
      </section>
      <section className="section bg-surface">
        <div className="container">
          <SectionHeading
            eyebrow="What we do"
            title="Our recruitment services"
            text="End-to-end support for Gulf employers and Indian candidates, from sourcing through mobilisation."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whatWeDo.map((x) => (
              <div className="card flex items-start gap-3 p-5" key={x}>
                <CheckCircle2 className="size-5 shrink-0 text-secondary" />
                <span className="text-sm font-semibold leading-6">{x}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container max-w-4xl">
          <SectionHeading
            eyebrow="Our approach"
            title="Clarity, professionalism and responsible recruitment"
          />
          <p className="mt-6 leading-8 text-muted-foreground">
            At Career Dunes, we believe international employment should be built
            on clarity, professionalism, and responsible recruitment practices.
            We focus on matching the right candidate with the right opportunity
            while maintaining clear communication with both employers and job
            seekers throughout the recruitment process.
          </p>
        </div>
      </section>
      <section className="section pt-0">
        <div className="container">
          <div className="rounded-md bg-primary p-10 text-center text-primary-foreground md:p-12">
            <p className="eyebrow text-primary-foreground/70">Career Dunes</p>
            <p className="mt-3 font-display text-3xl font-bold md:text-4xl">
              Building careers. Connecting opportunities.
            </p>
          </div>
        </div>
      </section>
      <FraudBand />
    </main>
  );
}
