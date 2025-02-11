import db from "@workspace/db";
import { posts } from "@workspace/db/schema";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { eq } from "drizzle-orm";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import useStore from "@workspace/store";

export const ResponsiveDialog = ({
  isOpen,
  setIsOpen,
  documentId,
  title,
  description,
  action,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  documentId: number;
  title: string;
  description?: string;
  action: string;
}) => {
  const { mutator } = useStore();
  const handleDelete = async () => {
    try {
      await db.delete(posts).where(eq(posts.id, documentId));
      setIsOpen(false);
      mutator?.();
      toast("Article has been deleted");
    } catch (err) {
      setIsOpen(false);
      toast("Failed to delete article");
      console.error(err);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            {action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
