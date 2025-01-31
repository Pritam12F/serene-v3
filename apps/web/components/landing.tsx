import { TypewriterEffect } from "./cta";
import Hero from "./hero";
import { MarqueeSection } from "./reviews";
import { FeaturesSection } from "./features";

export const Landing = () => {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <MarqueeSection />
      <TypewriterEffect />
    </>
  );
};
