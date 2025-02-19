import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

interface DialogProps {
  title?: string;
  description?: string;
  trigger: React.ReactNode;
  content: React.ReactNode;
  actionName?: React.ReactNode;
  action?: () => void;
}

export function PostDialog({
  title,
  description,
  trigger,
  content,
  action,
  actionName,
}: DialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {title && <DialogTitle>Edit profile</DialogTitle>}
          {description && (
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          )}
        </DialogHeader>
        {content}
        {actionName && (
          <DialogFooter>
            <Button onClick={action}>{actionName}</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
