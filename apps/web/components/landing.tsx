import WordPullUp from "@workspace/ui/components/magicui/word-pullup";
import { Background } from "./background-collision";
import { Footer } from "./footer";
import { cn } from "@workspace/ui/lib/utils";
import { OnScroll } from "./onscroll";

export const Landing = () => {
  return (
    <>
      <div
        className={cn(
          "h-[91vh] flex justify-center items-center border-none",
          "bg-[linear-gradient(to_bottom,#3c3c3c,#5c5c5c,#7d7d7d,#b3b3b3,_#ffffff)]",
          "dark:bg-[linear-gradient(to_bottom,#1c1c1c,#2c2c2c,#3d3d3d,#5c5c5c)]"
        )}
      >
        <WordPullUp
          className="text-4xl font-bold tracking-[-0.02em] text-black dark:text-white md:text-7xl md:leading-[5rem]"
          words="Serene will change the way you take notes"
        />
      </div>
      <OnScroll />
      <Background />
      <Footer />
    </>
  );
};
