import { PageHero } from "@/components/common/PageHero";
import { ReadyForm } from "@/components/common/ReadyForm";
import { SectionHeading } from "@/components/common/SectionHeading";
import { CircleAlert } from "lucide-react";

function page() {
  return (
    <main>
      <PageHero
        eyebrow="Fraud awareness"
        title="Verify a job or report suspicious recruitment"
        text="Check an offer, recruiter, payment request or job reference before you proceed. Asking early can prevent serious loss."
      />
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Know the warning signs"
              title="Pause if something feels wrong"
            />
            <ul className="space-y-4">
              {[
                "You are asked to pay into a personal account or use cash without a receipt.",
                "The recruiter promises a guaranteed visa or immediate departure.",
                "Salary and benefits are missing, unusually high or change repeatedly.",
                "You are pressured to surrender your passport or share an OTP.",
                "The offer uses unofficial email addresses or cannot be independently checked.",
              ].map((x) => (
                <li
                  className="flex gap-3 rounded-md bg-warning-soft p-4 text-sm leading-6"
                  key={x}
                >
                  <CircleAlert className="size-5 shrink-0 text-warning-soft-foreground" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 md:p-8">
            <h2 className="mb-6 font-display text-2xl font-bold">
              Request a verification
            </h2>
            <ReadyForm type="verify" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default page;