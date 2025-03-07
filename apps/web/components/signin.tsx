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
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

export const SignIn = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof SignInFormSchema>) {
    console.log(values);
  }
  return (
    <div className="min-h-screen mx-auto flex justify-center items-center w-[337px] lg:max-w-[350px]">
      <Card className="bg-gradient-to-tr from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-[#071f3d] dark:to-[#031c41]">
        <CardHeader className="flex justify-center">
          <CardTitle className="text-2xl">Login to your account</CardTitle>
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
              <Button type="submit">Log in</Button>
              <div className="flex justify-between">
                <Button className="w-[132px] lg:w-36">
                  <FaGoogle color="red" />
                  Google
                </Button>
                <Button className="w-[132px] lg:w-36">
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
