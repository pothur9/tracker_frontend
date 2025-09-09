import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/hero";
import { FeaturedStrategies } from "@/components/featured-strategies";
import { Insights } from "@/components/insights";
import { CTABand } from "@/components/cta-band";
import { Footer } from "@/components/site/footer";
import { WhyChoose } from "@/components/why-choose";
import { TrustStats } from "@/components/trust-stats";
import ParallaxSection from "@/components/ui/parallax-section";

export default function Page() {
  return (
    <main className="bg-blue-50">
      <Navbar />
      <ParallaxSection
        bgSrc="/images/backgrounds/hero-bg.jpg"
        overlayClassName="bg-black/20"
        speed={0.2}
      >
        <Hero />
      </ParallaxSection>

      <ParallaxSection
        bgSrc="/images/strategy-1.jpg"
        overlayClassName="bg-black/10"
        speed={0.18}
      >
        <FeaturedStrategies />
      </ParallaxSection>

      <ParallaxSection
        bgSrc="/images/backgrounds/why-choose-bg.jpg"
        overlayClassName="bg-black/10"
        speed={0.16}
      >
        <WhyChoose />
      </ParallaxSection>

      <ParallaxSection
        bgSrc="/images/hero-blue.jpg"
        overlayClassName="bg-black/10"
        speed={0.14}
      >
        <TrustStats />
      </ParallaxSection>

      <ParallaxSection
        bgSrc="/images/backgrounds/insights-bg.jpg"
        overlayClassName="bg-black/10"
        speed={0.12}
      >
        <Insights />
      </ParallaxSection>

      <ParallaxSection
        bgSrc="/images/backgrounds/cta-bg.jpg"
        overlayClassName="bg-black/20"
        speed={0.2}
      >
        <CTABand />
      </ParallaxSection>
      <Footer />
    </main>
  );
}
