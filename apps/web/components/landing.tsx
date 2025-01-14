import { TypewriterEffect } from "./cta";
import Hero from "./hero";
import { MarqueeSection } from "./reviews";
import { FeaturesSection } from "./features";

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
