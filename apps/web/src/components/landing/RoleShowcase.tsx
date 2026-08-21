import Link from "next/link";
import { ArrowRight, Briefcase, Search, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/landing/Reveal";

const ROLES = [
  {
    icon: Search,
    title: "For Buyers",
    description:
      "Build an investment profile once, and see every listing ranked by fit — sector, region, and deal size.",
    bullets: [
      "Create your investment profile",
      "Browse & filter live listings",
      "See match scores instead of guessing",
      "Message sellers directly",
    ],
    cta: { label: "Start browsing as a Buyer", href: "/register" },
  },
  {
    icon: Briefcase,
    title: "For Sellers",
    description:
      "Publish your listing once, and reach buyers who are already looking for exactly this profile.",
    bullets: [
      "Publish a listing in minutes",
      "Browse buyers ranked by fit",
      "See what each buyer is looking for",
      "Reach out directly, no broker needed",
    ],
    cta: { label: "List an asset", href: "/register" },
  },
  {
    icon: ShieldCheck,
    title: "For Platform Managers",
    description:
      "Full visibility into every participant and listing, with moderation tools to keep the marketplace trustworthy.",
    bullets: [
      "Search & filter every buyer, seller, and asset",
      "Suspend or remove non-compliant listings",
      "Monitor marketplace health at a glance",
    ],
    cta: null,
  },
] as const;

export function RoleShowcase() {
  return (
    <section id="roles" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-navy-950 sm:text-4xl">
            Built for every side of the deal
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-500">
            One marketplace, three purpose-built experiences — each designed around what that role
            actually needs to move a deal forward.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {ROLES.map((role, i) => (
            <Reveal key={role.title} delay={i * 120} className="h-full">
              <div
                className={cn(
                  "group flex h-full flex-col rounded-xl border border-navy-100 p-7 transition-all duration-200",
                  "hover:-translate-y-1 hover:shadow-lg hover:shadow-navy-100/50"
                )}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-950 transition-transform duration-200 group-hover:scale-110">
                  <role.icon size={20} className="text-gold-300" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-navy-950">{role.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-500">{role.description}</p>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {role.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-navy-700">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-400" />
                      {b}
                    </li>
                  ))}
                </ul>

                {role.cta && (
                  <Link
                    href={role.cta.href}
                    className="group/link mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-950 hover:text-gold-600"
                  >
                    {role.cta.label}
                    <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                  </Link>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
