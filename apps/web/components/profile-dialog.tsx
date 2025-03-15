import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

export const ProfileDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  return (
    <Dialog open>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>Hi there</DialogContent>
    </Dialog>
  );
};
