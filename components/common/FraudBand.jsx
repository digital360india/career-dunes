import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FraudBand() {
  return (
    <section className="bg-warning py-12 text-warning-foreground">
      <div className="container grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        <div className="flex gap-5">
          <div className="hidden size-14 shrink-0 place-items-center rounded-md bg-warning-foreground text-warning sm:grid">
            <ShieldCheck className="size-7" />
          </div>
          <div>
            <p className="eyebrow">Your safety comes first</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Verify every offer before you pay or travel.</h2>
            <p className="mt-3 max-w-3xl leading-7 opacity-80">
              Check the job reference, employer and communication with our team. Never pay anyone into a personal
              account or surrender your passport without a receipt.
            </p>
          </div>
        </div>
        <Button asChild variant="warning" size="lg">
          <Link href="/verify-job" className="flex items-center gap-2">
            Verify job / report fraud <ChevronRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}