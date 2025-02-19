import { SidebarExtension } from "@/components/sidebar-extension";
import { fetchSinglePostById } from "@/server/actions";
import db from "@workspace/db";

export default async function Documents({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>;
}) {
  const { slug } = await params;

  const postsHierarchy = slug?.map(async (posId) => {
    const { success, data } = await fetchSinglePostById(Number(posId));

    if (success) {
      return data;
    }
  });

  return <SidebarExtension />;
}
