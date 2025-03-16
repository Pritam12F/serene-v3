import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Mail, Paperclip, Pencil, Phone, Text } from "lucide-react";

export const ProfileDialog = ({
  trigger,
  isOpen,
  changeOpen,
  userDetails,
}: {
  trigger?: React.ReactNode;
  isOpen: boolean;
  changeOpen: Dispatch<SetStateAction<boolean>>;
  userDetails: {
    name: string;
    email: string;
    avatar?: string;
    phone?: number | null;
  };
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        changeOpen(false);
      }}
    >
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="w-[400px] lg:w-[450px] rounded-md py-10">
        <Tab userDetails={userDetails} />
      </DialogContent>
    </Dialog>
  );
};

function Tab({
  userDetails,
}: {
  userDetails: {
    name: string;
    email: string;
    avatar?: string;
    phone?: number | null;
  };
}) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);

  const randomColor = (() => {
    var letters = "0123456789abcdef";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  })();

  return (
    <Tabs defaultValue="account" className="w-[350px] lg:w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="password">Change Password</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="mt-8">
        {!isEditProfileOpen ? (
          <Card>
            <CardHeader className="space-y-4">
              <CardTitle className="text-2xl">Profile</CardTitle>
              <CardDescription>These are your profile details</CardDescription>
              <Avatar>
                <AvatarImage src={userDetails.avatar} alt="@user_profile" />
                <AvatarFallback style={{ backgroundColor: randomColor }}>
                  {userDetails.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent className="space-y-5 -mt-1">
              {
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-x-2 font-semibold">
                      <Pencil className="w-4 h-4" />
                      Name
                    </div>
                    <Input value={userDetails.name} disabled />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-x-2 font-semibold">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                    <Input value={userDetails.email} disabled />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-x-2 font-semibold">
                      <Phone className="w-4 h-4" />
                      Phone
                    </div>
                    <Input value={userDetails.phone ?? ""} disabled />
                  </div>
                </>
              }
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => setIsEditProfileOpen(true)}
                className="w-full"
              >
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Profile</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {
                <>
                  <div className="space-y-3">
                    <div className="flex items-center gap-x-2 font-semibold">
                      <Pencil className="w-4 h-4" />
                      Name
                    </div>
                    <Input defaultValue={userDetails.name} />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-x-2 font-semibold">
                      <Mail className="w-4 h-4" />
                      Email
                    </div>
                    <Input defaultValue={userDetails.email} />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-x-2 font-semibold">
                      <Phone className="w-4 h-4" />
                      Phone
                    </div>
                    <Input defaultValue={userDetails.phone ?? ""} />
                  </div>
                </>
              }
            </CardContent>
            <CardFooter className="space-x-4">
              <Button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-full"
                variant={"destructive"}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setIsEditProfileOpen(true)}
                className="w-full"
              >
                Confirm Changes
              </Button>
            </CardFooter>
          </Card>
        )}
      </TabsContent>
      <TabsContent value="password" className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-3">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button className="w-full">Change password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
