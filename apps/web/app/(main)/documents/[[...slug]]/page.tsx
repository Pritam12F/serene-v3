import PostDialog from "@/components/post-dialog";
import { SidebarExtension } from "@/components/sidebar-extension";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

export default async function Documents({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>;
}) {
  const { slug } = await params;

  if (slug && slug[0] === "newPost") {
    return <PostDialog />;
  }

  if (!slug) {
    return (
      <div className="h-screen w-full flex flex-col items-center">
        <div className="text-4xl my-48">No post selected...</div>
        <Link href={"/documents/newPost"}>
          <Button>Create new post</Button>
        </Link>
      </div>
    );
  }

  return <SidebarExtension documentList={slug} />;
}
