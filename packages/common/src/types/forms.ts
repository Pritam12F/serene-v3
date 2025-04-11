import { z } from "zod";

//Form Schema
export const SignInFormSchema = z.object({
  email: z.string().email({ message: "Not a valid email address" }),
  password: z.string().min(5, { message: "Password must be of length 5" }),
});

export const SignUpFormSchema = z
  .object({
    email: z.string().email({ message: "Not a valid email address" }),
    name: z.string().min(1, { message: "Name must be not empty" }),
    password: z
      .string()
      .min(5, { message: "Password must be at least of length 5" }),
    confirmPassword: z
      .string()
      .min(5, { message: "Password must be at least of length 5" }),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }
  );

export const UpdateUserSchema = z.object({
  phone: z.coerce
    .number({ message: "Invalid phone number" })
    .int()
    .gte(1000000000, { message: "Invalid phone number" })
    .lte(9999999999, { message: "Invalid phone number" }),
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(5, { message: "Password must be at least of length 5" }),
    newPassword: z
      .string()
      .min(5, { message: "Password must be at least of length 5" }),
    confirmNewPassword: z
      .string()
      .min(5, { message: "Password must be at least of length 5" }),
  })
  .refine(
    (values) => {
      return values.newPassword === values.confirmNewPassword;
    },
    {
      message: "Passwords must match!",
      path: ["confirmNewPassword"],
    }
  );
