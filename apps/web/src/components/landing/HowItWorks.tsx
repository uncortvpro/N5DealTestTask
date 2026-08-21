import { MessageSquare, Sparkles, UserPlus } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { GoldCtaLink } from "@/components/landing/CtaButtons";

const STEPS = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your profile",
    description:
      "Buyers set their investment criteria — sectors, regions, deal size. Sellers publish a listing in minutes.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Get matched",
    description:
      "Our matching engine scores every listing against your profile in real time — transparent, no black box.",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Connect directly",
    description: "Message the other side straight from the platform. No broker, no cold outreach.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-navy-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-500">
            Three steps between &quot;looking&quot; and &quot;in conversation.&quot;
          </p>
        </Reveal>

        <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-navy-100 sm:block" />
          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 120} className="relative text-center sm:text-left">
              <div className="relative z-10 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-950 text-sm font-bold text-gold-300 sm:mx-0">
                {step.number}
              </div>
              <div className="mt-5 flex items-center justify-center gap-2 sm:justify-start">
                <step.icon size={16} className="text-gold-600" />
                <h3 className="text-base font-semibold text-navy-950">{step.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">{step.description}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280} className="mt-14 flex justify-center">
          <GoldCtaLink href="/register">Create your profile</GoldCtaLink>
        </Reveal>
      </div>
    </section>
  );
}
