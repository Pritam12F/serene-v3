import { joinWorkspaceById } from "@/server/workspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import { CircleCheck, UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function JoinWorkspace() {
  const [inviteID, setInviteID] = useState("");
  const router = useRouter();

  const handleJoinWorkspace = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.preventDefault();

    const { success, message } = await joinWorkspaceById(inviteID);

    if (success) {
      toast.success("Joined workspace!", {
        style: { backgroundColor: "#38b000" },
      });
      router.push(`/workspaces/${inviteID}`);
    } else {
      toast.error(message, { style: { backgroundColor: "reds" } });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserRoundPlus className="opacity-70 hover:opacity-100 transition-all duration-250 w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex px-3 space-x-4 items-center w-56">
        <Input
          placeholder="Enter invite id"
          onChange={(e) => setInviteID(e.target.value)}
          value={inviteID}
        />
        <CircleCheck
          className="h-5 w-5 hover:text-green-500 transition-all duration-300 cursor-pointer"
          onClick={handleJoinWorkspace}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
