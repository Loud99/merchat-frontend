import { CinematicHero } from "@/components/ui/cinematic-landing-hero";
import SocialProofBar from "@/components/landing/SocialProofBar";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTASection from "@/components/landing/FinalCTASection";

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden">
      <CinematicHero />
      <SocialProofBar />
      <ProblemSection />
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
    </main>
  );
}
