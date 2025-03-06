import { TypewriterEffect } from "./cta";
import Hero from "./hero";
import { ReviewSection } from "./reviews";
import { FeaturesSection } from "./features";

export const Landing = () => {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <ReviewSection />
      <TypewriterEffect />
    </>
  );
};
