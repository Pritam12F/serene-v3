import PostDialog from "@/components/post-dialog";
import { SidebarExtension } from "@/components/sidebar-extension";

export default async function Documents({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>;
}) {
  const { slug } = await params;

  if (slug && slug[0] === "newPost") {
    return <PostDialog />;
  }

  return <SidebarExtension documentList={slug} />;
}
