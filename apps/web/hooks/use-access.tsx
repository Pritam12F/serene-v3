import { hasAccessToPost } from "@/server";
import { useEffect, useState } from "react";

const useAccess = (postId: string) => {
  const [isAccessible, setIsAccessible] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccess = async () => {
      try {
        setLoading(true);
        const result = await hasAccessToPost(postId);
        setIsAccessible(result.success);
      } catch (err) {
        setError("Failed to fetch post access information.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchAccess();
    }
  }, [postId]);

  return { isAccessible, loading, error };
};

export default useAccess;
