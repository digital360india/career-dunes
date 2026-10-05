import { PageHero } from "@/components/common/PageHero";

function page() {
  const steps = [
    [
      "01",
      "Employer requirement verified",
      "We review the company, role details, salary, conditions and hiring authority.",
    ],
    [
      "02",
      "Candidate sourcing",
      "Suitable people are reached through trade networks and registrations.",
    ],
    [
      "03",
      "Screening & trade assessment",
      "Experience, documents and practical skills are checked.",
    ],
    [
      "04",
      "Employer interview & selection",
      "Shortlisted candidates meet the employer and receive clear next steps.",
    ],
    [
      "05",
      "Offer & documentation",
      "Contract, medical, visa and required approvals are coordinated.",
    ],
    [
      "06",
      "Orientation & mobilisation",
      "Candidates receive travel guidance and pre-departure information.",
    ],
  ];
  return (
    <main>
      <PageHero
        eyebrow="Recruitment process"
        title="A clear path from requirement to mobilisation"
        text="Simple stages, transparent responsibilities and clear communication for everyone involved."
      />
      <section className="section">
        <div className="container max-w-4xl">
          {steps.map(([n, t, d]) => (
            <article
              className="grid gap-4 border-b border-border py-7 sm:grid-cols-[80px_1fr]"
              key={n}
            >
              <span className="font-display text-4xl font-bold text-secondary">
                {n}
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold">{t}</h2>
                <p className="mt-2 leading-7 text-muted-foreground">{d}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
export default page;