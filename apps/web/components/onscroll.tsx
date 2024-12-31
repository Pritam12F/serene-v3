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

type featureType = { feature: string; url: string };

function Card({ feature }: { feature: featureType }) {
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
          src={`${feature.url}`}
          className="rounded-md w-32 sm:w-40 md:w-64 lg:w-96 shadow-lg"
        />
      </motion.div>
      <motion.div className="text-[2rem] flex items-center justify-center w-32 md:w-48 lg:w-96 mr-20 md:mr-40">
        <TextGenerateEffect words={feature.feature} />
      </motion.div>
    </motion.div>
  );
}

const features: featureType[] = [
  {
    feature: "Rich Text Editor",
    url: "https://utfs.io/f/zYgyXAHp4Gqaxx6GP5Sh2uNOa8ZSd6w7eztWECJGUDXKjsIT",
  },
  {
    feature: "Team Workspaces",
    url: "https://utfs.io/f/zYgyXAHp4GqaQ1wBPSSk1pvHghFnxb9ReMCXTE02I6GzJ73N",
  },
  {
    feature: "Real-Time Collaboration",
    url: "https://utfs.io/f/zYgyXAHp4GqaHHpeTQgpSKtdn8UT4Duk9eyqP7RMG6CzBlEN",
  },
  {
    feature: "Organized Notes & Projects",
    url: "https://utfs.io/f/zYgyXAHp4Gqa15SV8d2Nez37LgPbmaMJ4cCdU5hwKxj6D0Ql",
  },
  {
    feature: "Responsive for different devices",
    url: "https://utfs.io/f/zYgyXAHp4GqaidIu4pPJSXkAemq3YaIs8DhRBGzUnVMQ9urT",
  },
];

export default function OnScroll() {
  return features.map((feature) => <Card feature={feature} />);
}
