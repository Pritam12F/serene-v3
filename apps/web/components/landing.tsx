import { TypewriterEffect } from "./cta";
import Hero from "./hero";
import { MarqueeSection } from "./reviews";
import { FeaturesSection } from "@workspace/ui/components/aceternityui/features-section";

export const Landing = () => {
  return (
    <>
      <Hero />
      <div className="bg-white dark:bg-gray-950">
        <FeaturesSection />
      </div>
      <MarqueeSection />
      <TypewriterEffect />
    </>
  );
};
