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
import { Mail, Pencil, Phone } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  UpdatePasswordSchema,
  UpdateUserSchema,
} from "@workspace/common/types/db";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";

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

  const form1 = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: userDetails.name,
      phone: userDetails.phone ?? 0,
    },
  });

  function onSubmit1(values: z.infer<typeof UpdateUserSchema>) {
    console.log(values);
  }

  const form2 = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  function onSubmit2(values: z.infer<typeof UpdatePasswordSchema>) {
    console.log(values);
  }

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
                <Form {...form1}>
                  <form
                    onSubmit={form1.handleSubmit(onSubmit1)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form1.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form1.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex flex-row space-x-3">
                      <Button
                        type="button"
                        variant={"destructive"}
                        onClick={() => setIsEditProfileOpen(false)}
                        className="w-full"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="w-full">
                        Submit
                      </Button>
                    </div>
                  </form>
                </Form>
              }
            </CardContent>
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
            <Form {...form2}>
              <form
                onSubmit={form2.handleSubmit(onSubmit2)}
                className="space-y-8"
              >
                <FormField
                  control={form2.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form2.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form2.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
