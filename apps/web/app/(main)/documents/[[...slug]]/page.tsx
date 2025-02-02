import { SidebarExtension } from "@/components/sidebar-extension";

export default async function Documents({
  params,
}: {
  params: Promise<{ slug: string[] | undefined }>;
}) {
  const { slug } = await params;
  return <SidebarExtension />;
}
