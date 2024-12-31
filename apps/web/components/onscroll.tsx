"use client";

import db from "@workspace/db";
import { useEffect, useState } from "react";
import { Card } from "./onscrollcard";

export function OnScroll() {
  const [images, setImages] = useState<{ feature: string; url?: string }[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const fetchedImages = await db.query.images.findMany({
          columns: {
            url: true,
          },
        });

        const updatedFeatures = features.map((feature, idx1) => {
          const matchedFeature = fetchedImages.find((_, idx2) => idx1 === idx2);
          return {
            ...feature,
            url: matchedFeature?.url,
          };
        });

        setImages(updatedFeatures);
      } catch (err) {
        console.error("Error fetching images:", err);
      }
    };

    fetchImages();
  }, []);

  return images.map((image, idx) => (
    <Card feature={image.feature} url={image.url!} key={idx} />
  ));
}

const features: { feature: string; url?: string }[] = [
  { feature: "Rich Text Editor" },
  { feature: "Team Workspaces" },
  { feature: "Real-Time Collaboration" },
  { feature: "Organized Notes & Projects" },
  { feature: "Responsive for different devices" },
];
