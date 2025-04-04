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
import { Mail, Pencil, Phone, User, Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  UpdatePasswordSchema,
  UpdateUserSchema,
} from "@workspace/common/types/forms";
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
import { fetchUserByEmail } from "@/server";

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
      <DialogContent className="w-11/12 md:w-[400px] lg:w-[500px] rounded-xl border shadow-2xl bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-slate-950 dark:via-slate-950 dark:to-black backdrop-blur-xl [&>button:last-child]:hidden transition-all duration-300">
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
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-green-500 to-green-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-pink-500 to-pink-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  })();

  const form1 = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      phone: userDetails.phone ?? 1,
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
      <TabsList className="grid w-full grid-cols-2 p-1 gap-1 bg-black/5 dark:bg-white/5 rounded-lg">
        <TabsTrigger
          value="profile"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 rounded-md transition-all duration-300 flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger
          value="password"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 rounded-md transition-all duration-300 flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Password
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6 space-y-6">
        {!isEditProfileOpen ? (
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-6 relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
                <Avatar className="w-28 h-28 border-4 border-white dark:border-gray-800 shadow-xl relative">
                  <AvatarImage
                    src={userDetails.avatar}
                    alt={userDetails.name}
                    className="object-cover"
                  />
                  <AvatarFallback
                    className={`text-3xl font-semibold ${randomColor} text-white`}
                  >
                    {userDetails.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {userDetails.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Manage your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-8 space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center space-x-4 rounded-xl border p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition duration-300">
                  <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {userDetails.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-xl border p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition duration-300">
                  <div className="p-2 rounded-full bg-green-50 dark:bg-green-900/20">
                    <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {userDetails.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button
                onClick={() => setIsEditProfileOpen(true)}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-50 dark:to-white dark:text-gray-900 hover:opacity-90 transition-opacity"
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
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
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
                            className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditProfileOpen(false)}
                      className="w-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-50 dark:to-white dark:text-gray-900 hover:opacity-90 transition-opacity"
                    >
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
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
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
                          className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10"
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
                          className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10"
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
                          className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-50 dark:to-white dark:text-gray-900 hover:opacity-90 transition-opacity"
                >
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
