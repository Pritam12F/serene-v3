import { SelectPostType } from "@workspace/common/types/db";
import { BreadcrumbEllipsis } from "@workspace/ui/components/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

export const BreadDropDown = ({ postList }: { postList?: SelectPostType }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1">
        <BreadcrumbEllipsis className="h-4 w-4" />
        <span className="sr-only">Toggle menu</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">{postList?.name}</DropdownMenuContent>
    </DropdownMenu>
  );
};
