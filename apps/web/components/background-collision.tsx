import { BackgroundBeamsWithCollision } from "@workspace/ui/components/aceternityui/background-beams";
import ShimmerButton from "@workspace/ui/components/magicui/shimmer-button";

export const Background = () => {
  return (
    <BackgroundBeamsWithCollision className="flex flex-col border-none">
      <div>
        <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
          What&apos;s cooler than Notion?{" "}
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
            <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-purple-500 via-violet-500 to-pink-500 [text-shadow:0_0_rgba(0,0,0,0.1)]">
              <span className="">Serene.</span>
            </div>
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
              <span className="">Serene.</span>
            </div>
          </div>
        </h2>
      </div>
      <ShimmerButton className="shadow-2xl my-5">
        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
          Sign up now
        </span>
      </ShimmerButton>
    </BackgroundBeamsWithCollision>
  );
};
