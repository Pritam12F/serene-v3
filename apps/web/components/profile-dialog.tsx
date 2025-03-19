import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Mail, Pencil, Phone, User, Lock, X } from "lucide-react";
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
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { fetchUserByEmail } from "@/server/actions";

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
      <DialogContent className="w-[400px] lg:w-[500px] rounded-lg p-10 border-none bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
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

  useEffect(() => {
    const fetch = async () => {
      const { success, data } = await fetchUserByEmail();

      if (success) {
        userDetails.phone = data?.phone;
      }
    };

    fetch();
  }, []);

  const randomColor = (() => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  })();

  const form1 = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      phone: userDetails.phone ?? 0,
    },
  });

  const form2 = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit1(values: z.infer<typeof UpdateUserSchema>) {
    try {
      const res = await axios.post("/api/user", {
        phone: values.phone,
      });

      if (res.status === 200) {
        toast.success("Profile updated successfully!", {
          duration: 1000,
          style: {
            backgroundColor: "#38b000",
          },
        });
        setIsEditProfileOpen(false);
        userDetails.phone = values.phone;
      }
    } catch (e) {
      toast.error("Failed to update profile", {
        duration: 3000,
        style: {
          backgroundColor: "red",
        },
      });
      console.error(e);
    }
  }

  async function onSubmit2(values: z.infer<typeof UpdatePasswordSchema>) {
    try {
      const res = await axios.post("/api/user/changepassword", values);

      if (res.status === 200) {
        toast.success("Password changed successfully!", {
          duration: 3000,
          style: {
            backgroundColor: "#38b000",
          },
        });
        form2.reset();
      }
    } catch (e) {
      if (isAxiosError(e)) {
        const errorMessages = {
          422: "Invalid password format",
          403: "Account not found",
          402: "Current password is incorrect",
          401: "Unauthorized access",
        };
        const status = e.response?.status as keyof typeof errorMessages;
        toast.error(errorMessages[status] || "An error occurred", {
          duration: 3000,
          style: {
            backgroundColor: "red",
          },
        });
        console.error(e);
      }
    }
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2 p-1 gap-1 bg-muted/20">
        <TabsTrigger
          value="profile"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger
          value="password"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Password
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        {!isEditProfileOpen ? (
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                    src={userDetails.avatar}
                    alt={userDetails.name}
                    className="object-cover"
                  />
                  <AvatarFallback
                    className={`text-2xl ${randomColor} text-white`}
                  >
                    {userDetails.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl font-bold">
                {userDetails.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-5 space-y-4">
              <div className="space-y-3">
                <div className="group flex items-center gap-x-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all duration-200 border border-border/5">
                  <div className="flex-shrink-0 p-2.5 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors duration-200">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground/70">
                      Email
                    </p>
                    <p className="mt-1 font-medium text-sm tracking-tight truncate">
                      {userDetails.email}
                    </p>
                  </div>
                </div>
                <div className="group flex items-center gap-x-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-all duration-200 border border-border/5">
                  <div className="flex-shrink-0 p-2.5 rounded-lg bg-primary/5 group-hover:bg-primary/10 transition-colors duration-200">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground/70">
                      Phone
                    </p>
                    <p className="mt-1 font-medium tracking-tight truncate">
                      {userDetails.phone || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                onClick={() => setIsEditProfileOpen(true)}
                className="w-full"
                variant="outline"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">
                  Edit Profile
                </CardTitle>
              </div>
              <CardDescription>
                Update your profile information below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form1}>
                <form
                  onSubmit={form1.handleSubmit(onSubmit1)}
                  className="space-y-6"
                >
                  <FormField
                    control={form1.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            className="bg-muted/30"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setIsEditProfileOpen(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="w-full">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="password" className="mt-6">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form2}>
              <form
                onSubmit={form2.handleSubmit(onSubmit2)}
                className="space-y-6"
              >
                <FormField
                  control={form2.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="bg-muted/30"
                        />
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
                        <Input
                          type="password"
                          {...field}
                          className="bg-muted/30"
                        />
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
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="bg-muted/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full mt-6">
                  Update Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
