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
import { Feature } from "@workspace/ui/components/aceternityui/feature";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}
