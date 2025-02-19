import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { SidebarMenuAction } from "@workspace/ui/components/sidebar";
import { CircleX, Edit, MoreHorizontal, Plus } from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";
import { ActionDialog } from "./action-dialog";
import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import useStore from "@workspace/store";
import { toast } from "sonner";
import { deletePostById } from "@/server/actions";
import { PostDialog } from "./post-dialog";
import dynamic from "next/dynamic";

export const WorkspaceActions = ({ documentId }: { documentId: number }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isNewPostOpen, setIsNewPostOpen] = useState<boolean>(false);
  const { mutator, changeActiveRenameId } = useStore();
  const Editor = dynamic(() => import("./editor"), { ssr: false });

  const handleDelete = async () => {
    const { success, message } = await deletePostById(documentId);
    if (success) {
      setIsDeleteOpen(false);
      mutator?.();
      toast(message);
    } else {
      setIsDeleteOpen(false);
      toast(message);
    }
  };

  return (
    <>
      <SidebarMenuAction showOnHover className="mx-8">
        <PostDialog
          trigger={<Plus />}
          content={<Editor onChange={() => {}} editable={true} />}
        />
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
      <ActionDialog
        title="Delete dialog"
        content="Are you sure you want to delete this?"
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        actionTitle="Delete"
        actionHandler={handleDelete}
        documentId={documentId}
      />
    </>
  );
};
