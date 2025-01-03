import WordPullUp from "@workspace/ui/components/magicui/word-pullup";
import { Background } from "./background-collision";
import { Footer } from "./footer";
import { OnScroll } from "./onscroll";
import { Ripple } from "@workspace/ui/components/magicui/ripple";

export const Landing = () => {
  return (
    <>
      <div className="relative flex h-[91vh] w-full flex-col items-center justify-center overflow-hidden bg-background">
        <WordPullUp
          className="text-4xl font-bold tracking-[-0.02em] text-black dark:text-white md:text-7xl md:leading-[5rem]"
          words="Serene will change the way you take notes"
        />
        <Ripple />
      </div>
      <OnScroll />
      <Background />
      <Footer />
    </>
  );
};
