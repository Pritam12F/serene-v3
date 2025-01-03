import db from "@workspace/db";
import { Card } from "./onscrollcard";

export async function OnScroll() {
  try {
    const fetchedImages = await db.query.images.findMany({
      columns: {
        url: true,
        name: true,
      },
    });

    return fetchedImages.map((feature, idx) => {
      if (feature.name === "logo") return null;

      return <Card feature={feature.name!} url={feature.url} key={idx} />;
    });
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return;
  }
}
