"use client";

import { TextGenerateEffect } from "@workspace/ui/components/aceternityui/text-generate";
import "../public/styles.css";
import { motion } from "framer-motion";

const cardVariants = {
  offscreen: {
    zIndex: 0,
    scale: 0.8,
    opacity: 0.5,
    transition: { duration: 0.5 },
  },
  onscreen: {
    zIndex: 10,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export function Card({ feature, url }: { feature: string; url: string }) {
  return (
    <motion.div
      className="overflow-visible h-[350px] md:h-[600px] flex items-center justify-center"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ amount: 0.5 }}
    >
      <motion.div
        className="text-[164px] rounded-[20px] flex justify-center items-center bg-white shadow-lg mx-auto"
        variants={cardVariants}
      >
        <img
          src={`${url}`}
          className="rounded-md w-32 sm:w-40 md:w-64 lg:w-96 shadow-lg"
        />
      </motion.div>
      <motion.div className="text-[2rem] flex items-center justify-center w-32 md:w-48 lg:w-96 mr-16 md:mr-80">
        <TextGenerateEffect words={feature} />
      </motion.div>
    </motion.div>
  );
}
