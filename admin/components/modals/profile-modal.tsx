"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
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
import ImageUpload from "../uploadthing/upload-image";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
      form.setValue("email", data.user.email);
      form.setValue("name", data.user.name);
      form.setValue("image", data.user.image);
    }
  }, [data, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    try {
      const res = await axios.patch(`/api/profile`, data);
      toast.success(res.data.success);
      router.refresh();
    } catch (error: any) {
      toast.error("something went wrong");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>Manage profile</DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid h-[300px] grid-cols-2 gap-6 "
          >
            <div className="h-full">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="h-full">
                    <div className="h-full w-full pt-4">
                      <ImageUpload
                        type="profile"
                        onChange={field.onChange}
                        value={field.value}
                        endpoint="profileImage"
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className=" flex h-[230px] flex-col items-center justify-evenly">
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
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-2 mt-auto flex w-full justify-between ">
              <Button
                disabled={isLoading}
                className=""
                variant={`outline`}
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Log Out
              </Button>
              <Button disabled={isLoading}>Confirm</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
