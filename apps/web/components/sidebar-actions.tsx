import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { SidebarMenuAction } from "@workspace/ui/components/sidebar";
import { CircleX, Edit, MoreHorizontal, Plus } from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";
import { ResponsiveDialog } from "./responsive-dialog";
import { useState } from "react";

export const SidebarActions = ({ title }: { title: string }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  return (
    <>
      <SidebarMenuAction showOnHover className="mx-8">
        <Plus />
      </SidebarMenuAction>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem asChild className="cursor-pointer">
            <span className="space-x-1">
              <Edit />
              Edit Project
            </span>
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem
            asChild
            className="cursor-pointer"
            onClick={() => {
              setIsDeleteOpen(true);
            }}
          >
            <span className="space-x-1">
              <CircleX className="text-red-400" />
              Delete Project
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ResponsiveDialog
        title="Delete dialog"
        description="Are you sure you want to delete this?"
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        action="Delete"
        documentName={title}
      />
    </>
  );
};
