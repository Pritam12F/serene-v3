import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Dispatch, SetStateAction } from "react";

export const ResponsiveDialog = ({
  isOpen,
  setIsOpen,
  title,
  content,
  actionTitle,
  actionHandler,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  documentId: number;
  title: string;
  content?: string | React.ReactNode;
  actionTitle?: string;
  actionHandler: () => void;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{content}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={actionHandler}>
            {actionTitle}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
