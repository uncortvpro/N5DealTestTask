"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/landing/Reveal";

const FAQS = [
  {
    q: "How does the match score work?",
    a: "Every listing is scored against a buyer's investment profile in real time — sector fit, geographic fit, and deal-size fit each carry a fixed weight. It's a transparent, deterministic calculation, not a black-box AI model, so both sides can see exactly why a score is what it is.",
  },
  {
    q: "Is messaging free?",
    a: "Yes. Once a buyer or seller reaches out, the conversation happens directly on the platform at no extra cost — no broker fees, no gated inbox.",
  },
  {
    q: "Can I be both a buyer and a seller?",
    a: "Each account has a single role today, chosen at registration. Nothing stops you from creating separate buyer and seller accounts with different emails if you're active on both sides of the market.",
  },
  {
    q: "How are listings and users moderated?",
    a: "Platform managers have full visibility into every participant and listing, and can suspend or remove anything that violates marketplace guidelines — with a reason attached, so the action is always explainable.",
  },
  {
    q: "What happens after I message someone?",
    a: "It opens a conversation thread in your inbox. From there you can keep messaging back and forth without leaving the platform or hunting through email.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-navy-50 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-500">
            Everything you need to know before you get started.
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-12 divide-y divide-navy-200 rounded-xl border border-navy-200 bg-white">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-navy-50/60"
                >
                  <span className="text-sm font-semibold text-navy-950">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-navy-400 transition-transform duration-300",
                      isOpen && "rotate-180 text-gold-500"
                    )}
                  />
                </button>
                <div
                  className="grid transition-all duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-navy-500">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
