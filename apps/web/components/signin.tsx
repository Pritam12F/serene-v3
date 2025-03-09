"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormSchema } from "@workspace/common/types/db";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { FaGithub } from "react-icons/fa";
import { Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export const SignIn = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = decodeURIComponent(searchParams.get("error") ?? "");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && error === "User is already registered with other method") {
      toast.error(error, { style: { backgroundColor: "red" } });
    }
  }, [isMounted]);

  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignInFormSchema>) {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!res?.error) {
      toast.success("Signed in!", {
        style: {
          backgroundColor: "#38b000",
        },
      });

      router.push("/documents");
      return;
    }

    toast.error("Incorrect details or email already registered with socials", {
      style: {
        backgroundColor: "red",
      },
    });
  }

  return (
    <div className="min-h-screen mx-auto flex justify-center items-center w-[337px] lg:max-w-[350px]">
      <Card className="bg-gradient-to-tr from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-[#071f3d] dark:to-[#031c41]">
        <CardHeader className="flex justify-center">
          <CardTitle className="text-2xl text-center">
            Login to your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 flex flex-col w-[300px]"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="lg:min-w-[300px]">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter email"
                        className="border-gray-600"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="dark:text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="lg:min-w-[300px]">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          placeholder="Enter password"
                          className="border-gray-600"
                          type={`${isPasswordVisible ? "text" : "password"}`}
                          {...field}
                        />
                        <span
                          onClick={() => {
                            setIsPasswordVisible((v) => !v);
                          }}
                          className="transition-all duration-400 -ml-8 mt-1.5 cursor-pointer"
                        >
                          {isPasswordVisible ? (
                            <EyeClosed className="opacity-20 transition-opacity duration-200 hover:opacity-80" />
                          ) : (
                            <Eye className="opacity-20 transition-opacity duration-200 hover:opacity-80" />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage className="dark:text-red-500" />
                  </FormItem>
                )}
              />
              <p>
                Don't have an account?{" "}
                <Link
                  href={"/sign-up"}
                  className="underline underline-offset-1 hover:underline-offset-2 transition-all duration-200"
                >
                  Sign up
                </Link>
              </p>
              <Button type="submit">Log in</Button>
              <div className="flex justify-between">
                <Button
                  className="w-[140px] lg:w-36"
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await signIn("google", {
                        redirect: false,
                      });

                      if (res?.ok) {
                        router.push("/documents");
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <Image
                    src={"/google-logo.svg"}
                    alt="google"
                    width={16}
                    height={16}
                  />
                  Google
                </Button>
                <Button
                  className="w-[140px] lg:w-36"
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await signIn("github", {
                        redirect: false,
                      });

                      if (res?.ok) {
                        router.push("/documents");
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                >
                  <FaGithub color="gray" />
                  Github
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
