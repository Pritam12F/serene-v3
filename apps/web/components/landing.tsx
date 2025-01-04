import CTA from "./cta";
import Features from "./features";
import Hero from "./hero";
import { MarqueeDemo } from "./reviews";

export const Landing = () => {
  return (
    <>
      <Hero />
      <Features />
      <MarqueeDemo />
      <CTA />
    </>
  );
};
