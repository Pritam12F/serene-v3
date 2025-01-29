import { SidebarTrigger } from "@workspace/ui/components/sidebar";

export function AppNavbar() {
  return (
    <div className="w-full py-2 flex items-center bg-white dark:bg-slate-950 sticky top-0">
      <SidebarTrigger size="icon" />
      <div>Hi there</div>
      <div></div>
    </div>
  );
}
