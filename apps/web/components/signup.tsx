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
import { Eye, EyeOff, Github } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios, { isAxiosError } from "axios";

export const SignUp = () => {
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
  const router = useRouter();

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
      const res = await axios.post("/api/auth/signup", {
        name: values.name,
        email: values.email,
        hashedPassword: values.password,
        accountType: "credentials",
      });

      if (res.status === 200) {
        toast.success("Signed up user!", {
          style: { backgroundColor: "#38b000" },
        });
        router.push("/documents");
      }
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.status === 409) {
          toast.error(
            `User already registered${err.response?.data.accountType === "credentials" ? "!" : ` with ${err.response?.data.accountType}`}`,
            { style: { backgroundColor: "red" } }
          );

          return;
        }

        toast.error("Oops couldn't signup!", {
          style: { backgroundColor: "red" },
        });
      }
    }
  }

  return (
    <div className="min-h-screen p-4 flex justify-center items-center">
      <Card className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-xl">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            Sign up to get started with our platform
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isPasswordVisible1 ? "text" : "password"}
                          placeholder="Create a password"
                          className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsPasswordVisible1(!isPasswordVisible1)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          {isPasswordVisible1 ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={isPasswordVisible2 ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsPasswordVisible2(!isPasswordVisible2)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                        >
                          {isPasswordVisible2 ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 dark:text-red-400" />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-2"
                >
                  Create Account
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
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
                      src="/google-logo.svg"
                      alt="Google"
                      className="mr-2"
                      width={15}
                      height={15}
                    />
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
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
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </Button>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                Already have an account?
                <Link
                  href="/sign-in"
                  className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors ml-1"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
