"use client";
import { CandidateForm } from "@/components/common/CandidateForm";
import { FraudBand } from "@/components/common/FraudBand";
import { PageHero } from "@/components/common/PageHero";
// import { ReadyForm } from "@/components/common/ReadyForm";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Can, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function page() {
  const { jobId } = useSearchParams();
  return (
    <main>
      <PageHero
        eyebrow="For job seekers"
        title="Take the next step in your trade career"
        text="Register once, tell us your experience and preferred destination, and we’ll match your profile with suitable verified roles."
      />
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <SectionHeading
              eyebrow="Candidate registration"
              title="Submit your profile and CV"
              text="Use accurate details. Shortlisted candidates are contacted only when a suitable requirement is available."
            />
            <ul className="space-y-3">
              {[
                "No guarantee of selection or visa",
                "Never share an OTP or banking PIN",
                "Keep receipts for every official payment",
                "Verify every job reference before proceeding",
              ].map((x) => (
                <li className="flex gap-3 text-sm" key={x}>
                  <CheckCircle2 className="size-5 shrink-0 text-success" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6 md:p-8">
            {/* <ReadyForm type="candidate" jobId={jobId} /> */}
            <Suspense
              fallback={
                <p className="text-center text-muted-foreground">
                  Loading form…
                </p>
              }
            >
              <CandidateForm jobId={jobId} />
            </Suspense>
          </div>
        </div>
      </section>
      <FraudBand />
    </main>
  );
}
export default page;
