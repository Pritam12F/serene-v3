import { createWorkspace } from "@/server/workspace";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";
import { CodeBlock } from "@workspace/ui/components/code-block";
import { useRouter } from "next/navigation";

export const NewWorkspace = ({
  isOpen,
  setIsOpen,
  mutator,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  mutator: () => {};
}) => {
  const [isPostCreated, setIsPostCreated] = useState(false);
  const [name, setName] = useState("");
  const [inviteId, setInviteId] = useState("");
  const router = useRouter();

  const handleCreatePost = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { success, data } = await createWorkspace(name);

    if (success) {
      toast.success("Workspace created", {
        style: { backgroundColor: "#38b000" },
      });
      setInviteId(data?.inviteId!);
      setIsPostCreated(true);
      mutator();
      router.push(`/workspaces/${data?.id}`);
    } else {
      toast.error("Couldn't create workspace", {
        style: {
          backgroundColor: "red",
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {isPostCreated ? (
        <DialogContent className="flex flex-col space-y-2 z-[9999] w-10/12 rounded-md md:w-2/4 xl:w-2/6">
          Your invite id is{" "}
          <CodeBlock
            language="text"
            highlightLines={[9, 13, 14, 18]}
            code={inviteId}
          />
        </DialogContent>
      ) : (
        <DialogContent className="flex flex-col space-y-2 z-[9999] w-10/12 rounded-md md:w-2/4 xl:w-2/6">
          <DialogHeader className="flex flex-col space-y-5">
            <DialogTitle>Add a new workspace</DialogTitle>
            <DialogDescription className="space-y-5">
              <Label htmlFor="post_name">Name</Label>
              <Input
                id="post_name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="mx-auto" onClick={handleCreatePost}>
              Create workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
