import { TypewriterEffect } from "./cta";
import Hero from "./hero";
import { MarqueeDemo } from "./reviews";
import { FeaturesSectionDemo } from "@workspace/ui/components/aceternityui/features-section";

export const Landing = () => {
  return (
    <>
      <Hero />
      <div className="bg-white dark:bg-gray-950">
        <FeaturesSectionDemo />
      </div>
      <MarqueeDemo />
      <TypewriterEffect />
    </>
  );
};
