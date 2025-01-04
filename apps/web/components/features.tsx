import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { CheckCircle, PenTool, Zap } from "lucide-react";

const features = [
  {
    title: "Intuitive Note-Taking",
    description:
      "Capture your thoughts effortlessly with our clean and distraction-free interface.",
    icon: PenTool,
  },
  {
    title: "Smart Organization",
    description:
      "Automatically categorize and link your notes for easy retrieval and connection of ideas.",
    icon: CheckCircle,
  },
  {
    title: "Lightning-Fast Search",
    description:
      "Find exactly what you need in seconds with our powerful search capabilities.",
    icon: Zap,
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 px-4 md:px-6 lg:px-8 bg-white dark:bg-gray-800"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200">
          Why Choose Serene?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-50 dark:bg-gray-700 border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader className="text-center">
                <div className="mx-auto bg-blue-100 dark:bg-blue-900 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
