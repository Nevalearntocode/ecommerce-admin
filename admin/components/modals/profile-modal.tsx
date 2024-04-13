"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import useModal from "@/hooks/use-modal-store";
import { Input } from "../ui/input";
import Image from "next/image";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";

type Props = {};

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, { message: "Name needs at least 2 characters" }),
  image: z.string(),
});

type FormType = z.infer<typeof formSchema>;

const ProfileModal = (props: Props) => {
  const { isOpen, close, type, data } = useModal();
  const isModalOpen = type === "profile" && isOpen;

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      image: "",
      name: "",
    },
  });

  useEffect(() => {
    if (data && data.user) {
      form.setValue("name", data.user.name);
      form.setValue("email", data.user.email);
      form.setValue("image", data.user.image);
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    console.log(data);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>Manage profile</DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-6"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <Image
                    src={"/placeholder.jpg"}
                    alt="profileImage"
                    height={360}
                    width={360}
                  />
                </FormItem>
              )}
            />
            <div className="h-full flex items-center justify-evenly flex-col">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled={true} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2 w-full flex justify-between">
              <Button
                className=""
                variant={`outline`}
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Log Out
              </Button>
              <Button>Confirm</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
