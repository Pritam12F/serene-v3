import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@workspace/ui/components/sidebar";

export default function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {children}
    </SidebarProvider>
  );
}
