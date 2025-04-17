import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { SidebarMenuAction } from "@workspace/ui/components/sidebar";
import {
  ArrowUpRight,
  Edit,
  LinkIcon,
  MoreHorizontal,
  Plus,
  Star,
  StarIcon,
  Trash2,
} from "lucide-react";
import { ActionDialog } from "./action-dialog";
import { useState } from "react";
import useStore from "@workspace/store";
import { toast } from "sonner";
import { addToFavorite, deletePostById } from "@/server";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

export const PostActions = ({
  documentId,
  parentId,
  isHovered = false,
}: {
  documentId: string;
  parentId: string;
  isHovered?: boolean;
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { mutator, changeActivePostId, removePostName } = useStore();
  const router = useRouter();
  const { favoriteMutator } = useStore();
  const parentIdParams = encodeURIComponent(parentId.substring(11));

  const handleDelete = async () => {
    const { success, message } = await deletePostById(documentId);
    if (success) {
      mutator?.();
      favoriteMutator?.();
      setIsDeleteOpen(false);
      removePostName(documentId);
      toast(message);
    } else {
      setIsDeleteOpen(false);
      toast(message);
    }
  };

  const handleAddFavorite = async () => {
    const { success, message } = await addToFavorite(documentId);

    if (success) {
      favoriteMutator?.();
    }

    toast(message, {
      style: { backgroundColor: "#38b000" },
    });
  };

  return (
    <div>
      <SidebarMenuAction
        className="mx-8"
        onClick={(e) => {
          e.preventDefault();
          router.push(`/documents/newPost?parentId=${parentIdParams}`);
        }}
        onTouchStart={(e) => {
          router.push(`/documents/newPost?parentId=${parentIdParams}`);
        }}
      >
        <Plus
          className={`${isHovered ? "block" : "hidden"} transition-all duration-200`}
        />
      </SidebarMenuAction>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg z-[9999]"
          side={isMobile ? "bottom" : "right"}
          align={isMobile ? "end" : "start"}
        >
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              changeActivePostId(documentId);
            }}
          >
            <Edit className="text-muted-foreground" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async (e) => {
              e.preventDefault();

              await navigator.clipboard.writeText(
                `${window.origin}/documents/${documentId}`
              );

              toast("Copied link!");
            }}
          >
            <LinkIcon className="text-muted-foreground" />
            <span>Copy Link</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              window.open(`/documents/${documentId}`, "_blank", "noopener");
            }}
            className="cursor-pointer"
          >
            <ArrowUpRight className="text-muted-foreground" />
            <span>Open in New Tab</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleAddFavorite}
          >
            <StarIcon className="text-orange-600 dark:text-orange-300" />
            <span>Add favorite</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 className="text-red-500" />
            <span>Delete</span>
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
    </div>
  );
};
