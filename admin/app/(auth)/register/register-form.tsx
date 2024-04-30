"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {};

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
    .regex(/\d/, { message: "Password must contain a number" }),
  password2: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
    .regex(/\d/, { message: "Password must contain a number" }),
});
type FormType = z.infer<typeof formSchema>;

const RegisterForm = (props: Props) => {
  const router = useRouter();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      password2: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    if (data.password !== data.password2) {
      toast.error("Password fields don't match.");
      return;
    }
    try {
      const res = await axios.post(`/api/auth/register`, {
        email: data.email,
        password: data.password,
      });

      if (res.status === 200) {
        signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        }).then(() => {
          router.push(`/`);
        });
      }
      toast.success("Welcome!");
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="******"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password2"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Your Password</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="******"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4 flex w-full flex-col gap-y-6">
          <Button disabled={isLoading} className="w-full">
            Register
          </Button>
          <Button
            disabled={isLoading}
            className="w-full"
            variant={`outline`}
            onClick={(e) => {
              e.preventDefault();
              signIn("google");
            }}
          >
            Register With Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
