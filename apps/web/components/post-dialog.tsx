import {
  Dialog,
  DialogContent,
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
  action?: (args: any[]) => void;
  actionArgs: any[];
}

export function PostDialog({
  title,
  description,
  trigger,
  content,
  action,
  actionName,
  actionArgs,
}: DialogProps) {
  return (
    <Dialog
      onOpenChange={(e) => {
        if (!e && action) {
          action(actionArgs);
        }
      }}
    >
      <DialogTrigger className="newPostTrigger" asChild>
        {trigger}
      </DialogTrigger>
      <DialogHeader>{title && <DialogTitle>{title}</DialogTitle>}</DialogHeader>
      <DialogContent className="dark:bg-gray-900">{content}</DialogContent>
    </Dialog>
  );
}
