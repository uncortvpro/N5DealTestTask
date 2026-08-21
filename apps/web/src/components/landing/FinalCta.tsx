import { Reveal } from "@/components/landing/Reveal";
import { GoldCtaLink, OutlineCtaLink } from "@/components/landing/CtaButtons";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-24">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, #d3a24a 0%, transparent 70%)",
          animation: "glow-pulse 7s ease-in-out infinite",
          ["--glow-ty" as string]: "-50%",
        }}
      />
      <Reveal className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Ready to find your next deal?
        </h2>
        <p className="mt-4 text-base text-navy-300">
          Create your profile in minutes — as a buyer, as a seller, or both.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <GoldCtaLink href="/register">Get Started</GoldCtaLink>
          <OutlineCtaLink href="/login">Sign in</OutlineCtaLink>
        </div>
      </Reveal>
    </section>
  );
}
