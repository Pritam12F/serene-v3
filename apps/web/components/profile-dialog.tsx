import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  UpdatePasswordSchema,
  UpdateUserSchema,
} from "@workspace/common/types/forms";
import { z } from "zod";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";
import { fetchUserByEmail } from "@/server";
import { BadgeCheckIcon, KeyRound, UserPen } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";

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
    profileColor?: string | null;
    coverColor?: string | null;
  };
}) => {
  const [profileDialogContent, setProfileDialogContent] = useState<
    "profile" | "password"
  >("profile");
  const [color, setColor] = useState<{
    coverColor: string;
    profileColor: string;
  }>({ coverColor: "bg-green-500", profileColor: "bg-green-500" });

  useEffect(() => {
    const fetch = async () => {
      const { success, data } = await fetchUserByEmail();
      if (success) {
        userDetails.phone = data?.phone;
      }

      setColor((prev) => ({
        ...prev,
        coverColor: data?.coverColor!,
        profileColor: data?.profileColor!,
      }));
    };

    fetch();
  }, [userDetails]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        changeOpen(false);
      }}
    >
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="w-11/12 md:w-[400px] lg:w-[470px] p-1 pb-4 rounded-2xl border-0 shadow-[0_0_1rem_rgba(0,0,0,0.1)] dark:shadow-[0_0_1rem_rgba(255,255,255,0.1)] bg-white dark:bg-black backdrop-blur-xl transition-all duration-500 ease-in-out">
        <div className={cn("h-32 rounded-lg", color.coverColor)}>
          {userDetails.avatar ? (
            <img
              src={userDetails.avatar}
              className="rounded-full w-24 h-24 mt-16 ml-6"
            />
          ) : (
            <div
              className={cn(
                "flex relative justify-center font-semibold text-3xl items-center w-24 h-24 rounded-full mt-16 ml-6 border-2 border-slate-600",
                color.profileColor
              )}
            >
              {userDetails.name && userDetails.name[0]?.toUpperCase()}
              <div className="absolute top-[73px] left-14 rounded-full bg-blue-100 p-0.5">
                <BadgeCheckIcon className="text-blue-500 w-5 h-5" />
              </div>
            </div>
          )}
        </div>

        <UserDetails
          name={userDetails.name}
          email={userDetails.email}
          joinedDate={new Date()}
          changeDialogView={setProfileDialogContent}
        />
        {profileDialogContent === "profile" && (
          <ProfileForm
            name={userDetails.name}
            phone={userDetails.phone ?? 1234567890}
          />
        )}
        {profileDialogContent === "password" && <PasswordForm />}
        <Button onClick={() => console.log(color)}>click</Button>
      </DialogContent>
    </Dialog>
  );
};

export const UserDetails = ({
  email,
  name,
  joinedDate,
  changeDialogView,
}: {
  email: string;
  name: string;
  joinedDate?: Date;
  changeDialogView: Dispatch<SetStateAction<"profile" | "password">>;
}) => {
  const joinedString = useMemo(() => {
    const joinedArray = joinedDate?.toDateString().split(" ").slice(1);
    joinedArray![2] = ",";
    joinedArray![0] = joinedArray![0]?.concat(" ")!;
    const joinedYear = joinedDate?.toDateString().split(" ").slice(3);

    return joinedArray?.join("").concat(` ${joinedYear}`);
  }, [joinedDate]);

  return (
    <div className="mt-10 ml-7 space-y-3">
      <div className="flex justify-end mx-2 space-x-2 -translate-y-10">
        <Button variant={"outline"} onClick={() => changeDialogView("profile")}>
          <UserPen />
          Profile
        </Button>
        <Button
          variant={"outline"}
          onClick={() => changeDialogView("password")}
        >
          <KeyRound />
          Password
        </Button>
      </div>
      <div className="text-2xl">{name}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{email}</div>
      {joinedDate && (
        <div className="flex justify-stretch items-center space-x-2">
          <div className="text-base text-slate-600 dark:text-slate-300">
            Joined on
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-[1px]">
            {joinedString}
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileForm = ({ name, phone }: { name: string; phone: number }) => {
  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      phone: phone ?? 1234567890,
      name: name ?? "Anonymous",
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateUserSchema>) {
    try {
      const res = await axios.post("/api/user", {
        phone: values.phone,
        name: values.name,
      });

      if (res.status === 200) {
        toast.success("Profile updated successfully!", {
          duration: 1000,
          style: {
            backgroundColor: "#38b000",
          },
        });
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col mx-7"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Change name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Change number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-1/3 mx-auto">
          Submit
        </Button>
      </form>
    </Form>
  );
};

const PasswordForm = () => {
  const form = useForm<z.infer<typeof UpdatePasswordSchema>>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof UpdatePasswordSchema>) {
    try {
      const res = await axios.post("/api/user/changepassword", values);

      if (res.status === 200) {
        toast.success("Password changed successfully!", {
          duration: 3000,
          style: {
            backgroundColor: "#38b000",
          },
        });
        form.reset();
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 flex flex-col mx-7"
      >
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter current password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter new password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirm new password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-1/2 mx-auto">
          Change password
        </Button>
      </form>
    </Form>
  );
};
