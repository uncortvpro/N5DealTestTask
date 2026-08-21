import { redirect } from "next/navigation";
import { getSession, roleHome } from "@/lib/session";
import { apiFetch } from "@/lib/serverFetch";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Hero } from "@/components/landing/Hero";
import { RoleShowcase } from "@/components/landing/RoleShowcase";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { MatchScoreShowcase } from "@/components/landing/MatchScoreShowcase";
import { SectorStrip } from "@/components/landing/SectorStrip";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCta } from "@/components/landing/FinalCta";
import { LandingFooter } from "@/components/landing/LandingFooter";

interface PublicStats {
  buyers: number;
  sellers: number;
  activeAssets: number;
  sectors: number;
}

export default async function HomePage() {
  const user = await getSession();
  if (user) redirect(roleHome(user.role));

  const { ok, data } = await apiFetch<PublicStats>("/api/public/stats");

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <Hero stats={ok ? data : null} />
      <RoleShowcase />
      <ComparisonSection />
      <HowItWorks />
      <MatchScoreShowcase />
      <SectorStrip />
      <FaqSection />
      <FinalCta />
      <LandingFooter />
    </div>
  );
}
