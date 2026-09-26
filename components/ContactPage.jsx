import { CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LiveChat } from "./common/LiveChat";
import { ReadyForm } from "./common/ReadyForm";
import { SectionHeading } from "./common/SectionHeading";
import { PageHero } from "./common/PageHero";


export function ContactPage() {
  const WHATSAPP_NUMBER = "918303022306";
  const WHATSAPP_DISPLAY = "+91 83030 22306";
  return (
    <main>
      <PageHero
        eyebrow="Contact & support"
        title="Talk to Career Dunes"
        text="Chat with us on WhatsApp, send an enquiry or raise a grievance. We will direct it to the right team."
      >
        <Button asChild variant="highlight" size="lg">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </Button>
      </PageHero>
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div className="space-y-8">
            <div>
              <SectionHeading title="How can we help?" />
              <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  WhatsApp:{" "}
                  <a
                    className="font-bold text-secondary"
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {WHATSAPP_DISPLAY}
                  </a>
                </p>
                <p>
                  Our official email address and office address will appear here
                  after verification. Until then, use the WhatsApp chat or the
                  enquiry form.
                </p>
                <div className="rounded-md bg-warning-soft p-5 text-warning-soft-foreground">
                  <CircleAlert className="size-6" />
                  <strong className="mt-3 block text-foreground">
                    Need to raise a grievance?
                  </strong>
                  <p className="mt-2">
                    Describe the issue in your message and include the job
                    reference, date and concern. Do not include bank PINs or
                    OTPs.
                  </p>
                </div>
              </div>
            </div>
            <LiveChat />
          </div>
          <div id="contact-email-form" className="card h-fit p-6 md:p-8">
            <h2 className="mb-6 font-display text-2xl font-bold">
              Send us an email enquiry
            </h2>
            <ReadyForm type="contact" />
          </div>
        </div>
      </section>
    </main>
  );
}
