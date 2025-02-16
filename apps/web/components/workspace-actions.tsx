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
import { Button } from "@workspace/ui/components/button";
import useStore from "@workspace/store";

export const WorkspaceActions = ({ documentId }: { documentId: number }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const { changeActiveRenameId } = useStore();

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
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Button
              variant="ghost"
              className="w-full focus-visible:ring-0 px-2 justify-normal"
              onClick={() => {
                changeActiveRenameId(documentId);
              }}
            >
              <Edit className="h-4 w-4" />
              Rename
            </Button>
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem
            asChild
            className="cursor-pointer"
            onClick={() => {
              setIsDeleteOpen(true);
            }}
          >
            <Button
              variant="ghost"
              className="w-full focus-visible:ring-0 justify-normal"
            >
              <CircleX className="text-red-400 h-5 w-5" />
              Delete Project
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ResponsiveDialog
        title="Delete dialog"
        description="Are you sure you want to delete this?"
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        action="Delete"
        documentId={documentId}
      />
    </>
  );
};
