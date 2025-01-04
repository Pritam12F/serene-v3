import { Button } from "@workspace/ui/components/button";

export default function CTA() {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-90 dark:from-blue-800 dark:to-purple-800"></div>
      <div className="relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Ready to bring serenity to your workflow?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
          Join thousands of users who have transformed their productivity with
          Serene.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="bg-white text-blue-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
        >
          Join now
        </Button>
      </div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
    </section>
  );
}
