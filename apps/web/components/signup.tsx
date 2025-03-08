"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormSchema } from "@workspace/common/types/db";
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
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export const SignUp = () => {
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    try {
      await axios.post("/api/auth/signup", {
        email: values.email,
        name: values.name,
        hashedPassword: values.password,
      });

      toast.success("Signed up user!", {
        style: {
          backgroundColor: "#38b000",
        },
      });
    } catch {
      toast.error("Error signin up user!", {
        style: { backgroundColor: "red" },
      });
    }
  }

  return (
    <div className="min-h-screen mx-auto flex justify-center items-center w-[337px] lg:max-w-[350px]">
      <Card className="bg-gradient-to-tr from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-[#071f3d] dark:to-[#031c41]">
        <CardHeader className="flex justify-center">
          <CardTitle className="text-2xl text-center">
            Sign up for a new account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-7 flex flex-col w-[300px]"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="lg:min-w-[300px]">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
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
                          type={`${isPasswordVisible1 ? "text" : "password"}`}
                          {...field}
                        />
                        <span
                          onClick={() => {
                            setIsPasswordVisible1((v) => !v);
                          }}
                          className="transition-all duration-400 -ml-8 mt-1.5 cursor-pointer"
                        >
                          {isPasswordVisible1 ? (
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="lg:min-w-[300px]">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          placeholder="Re-enter password"
                          className="border-gray-600"
                          type={`${isPasswordVisible2 ? "text" : "password"}`}
                          {...field}
                        />
                        <span
                          onClick={() => {
                            setIsPasswordVisible2((v) => !v);
                          }}
                          className="transition-all duration-400 -ml-8 mt-1.5 cursor-pointer"
                        >
                          {isPasswordVisible2 ? (
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
                Already have an account?{" "}
                <Link
                  href={"/sign-in"}
                  className="underline underline-offset-1 hover:underline-offset-2 transition-all duration-200"
                >
                  Sign in
                </Link>
              </p>
              <Button type="submit">Sign up</Button>
              <div className="flex justify-between">
                <Button
                  className="w-[140px] lg:w-36"
                  onClick={async () => {
                    await signIn("google", {
                      callbackUrl: `${window.location.origin}/documents`,
                    });
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
                  onClick={async () => {
                    await signIn("github", {
                      callbackUrl: `${window.location.origin}/documents`,
                    });
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
