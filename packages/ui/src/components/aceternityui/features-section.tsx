import {
  IconAdjustmentsBolt,
  IconCloud,
  IconEaseInOut,
  IconEdit,
  IconHelp,
  IconHierarchy,
  IconSearch,
  IconTerminal2,
} from "@tabler/icons-react";
import { cn } from "@workspace/ui/lib/utils";

export function FeaturesSection() {
  const features = [
    {
      title: "Intuitive Note-Taking",
      description:
        "Capture your thoughts effortlessly with our clean and distraction-free interface.",
      icon: <IconEdit />,
    },
    {
      title: "Smart Organization",
      description:
        "Automatically categorize and link your notes for easy retrieval and connection of ideas.",
      icon: <IconHierarchy />,
    },
    {
      title: "Lightning-Fast Search",
      description:
        "Find exactly what you need in seconds with our powerful search capabilities.",
      icon: <IconSearch />,
    },
    {
      title: "Ease of Use",
      description:
        "It's as easy as using an Apple, and as expensive as buying one.",
      icon: <IconEaseInOut />,
    },
    {
      title: "100% Uptime Guarantee",
      description: "We just cannot be taken down by anyone.",
      icon: <IconCloud />,
    },
    {
      title: "24/7 Customer Support",
      description:
        "We are available 100% of the time. At least our AI agents are.",
      icon: <IconHelp />,
    },
    {
      title: "Money-Back Guarantee",
      description:
        "If you don’t like EveryAI, we will convince you to like us.",
      icon: <IconAdjustmentsBolt />,
    },
    {
      title: "Built for Developers",
      description:
        "Built for engineers, developers, dreamers, thinkers, and doers.",
      icon: <IconTerminal2 />,
    },
  ];

  return (
    <div className="grid grid-cols-1 dark:bg-gray-950 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
