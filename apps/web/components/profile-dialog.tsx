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
      <DialogContent className="w-11/12 md:w-[400px] lg:w-[500px] rounded-2xl border-0 shadow-[0_0_1rem_rgba(0,0,0,0.1)] dark:shadow-[0_0_1rem_rgba(255,255,255,0.1)] bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-black backdrop-blur-xl [&>button:last-child]:hidden transition-all duration-500 ease-in-out">
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
      "bg-gradient-to-br from-violet-500 to-purple-600",
      "bg-gradient-to-br from-emerald-500 to-green-600",
      "bg-gradient-to-br from-blue-500 to-indigo-600",
      "bg-gradient-to-br from-rose-500 to-pink-600",
      "bg-gradient-to-br from-amber-500 to-orange-600",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  })();

  const form1 = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      phone: userDetails.phone ?? 1234567890,
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
    <Tabs
      defaultValue="profile"
      className="w-full transition-height duration-900"
    >
      <TabsList className="grid w-full h-10 grid-cols-2 gap-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl">
        <TabsTrigger
          value="profile"
          className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-900 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 py-1"
        >
          <User className="w-4 h-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger
          value="password"
          className="data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-gray-900 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 py-1"
        >
          <Lock className="w-4 h-4" />
          Password
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-8 space-y-6">
        {!isEditProfileOpen ? (
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-8 relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 opacity-25 group-hover:opacity-50 blur-lg transition duration-500"></div>
                <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900 shadow-2xl relative ring-2 ring-gray-100 dark:ring-gray-800">
                  <AvatarImage
                    src={userDetails.avatar}
                    alt={userDetails.name}
                    className="object-cover"
                  />
                  <AvatarFallback
                    className={`text-4xl font-bold ${randomColor} text-white`}
                  >
                    {userDetails.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                {userDetails.name}
              </CardTitle>
              <CardDescription className="text-muted-foreground/80 mt-2 text-sm">
                Manage your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-8 space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center space-x-4 rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-300 ease-in-out group">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Email</p>
                    <p className="text-sm text-muted-foreground/80">
                      {userDetails.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-xl border border-gray-100 dark:border-gray-800 p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-300 ease-in-out group">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">Phone</p>
                    <p className="text-sm text-muted-foreground/80">
                      {userDetails.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-6">
              <Button
                onClick={() => setIsEditProfileOpen(true)}
                className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white dark:text-gray-900 hover:opacity-90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl"
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
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                  Edit Profile
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground/80">
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
                        <FormLabel className="text-sm font-medium">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            className="bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all duration-300"
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
                      className="w-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white dark:text-gray-900 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
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

      <TabsContent value="password" className="mt-8">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Change Password
            </CardTitle>
            <CardDescription className="text-muted-foreground/80">
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
                      <FormLabel className="text-sm font-medium">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all duration-300"
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
                      <FormLabel className="text-sm font-medium">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all duration-300"
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
                      <FormLabel className="text-sm font-medium">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-violet-500/20 dark:focus:ring-violet-400/20 transition-all duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white dark:text-gray-900 hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
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
