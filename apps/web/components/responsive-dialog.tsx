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
  documentName,
  title,
  description,
  action,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  documentName?: string;
  title: string;
  description?: string;
  action: string;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive">{action}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
