"use client";

import React, { useEffect, useRef, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Staff, Store } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useModal from "@/hooks/use-modal-store";
import { generateSlug } from "@/constant";
import APIAlert from "@/components/api-alert";
import { useOrigin } from "@/hooks/use-origin";

type Props = {
  store: Store;
  isOwner: boolean;
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").trim(),
  slug: z.string().transform((value) => value.trim().replace(/\s+/g, "-")),
});

type FormType = z.infer<typeof formSchema>;

const SettingsForm = ({ store, isOwner }: Props) => {
  const { open, close } = useModal();
  const origin = useOrigin();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    form.setValue("name", store.name);
    form.setValue("slug", store.slug);
  }, [store]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    if (data.name === store.name && data.slug === store.slug) {
      toast.info("Store has not changed.");
      return;
    }
    try {
      const res = await axios.patch(`/api/store/${store.slug}`, data);
      toast.success(res.data.success);

      setTimeout(() => {
        window.location.assign(`/${generateSlug({ ...data })}/settings`);
      }, 1000);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const onDelete = async () => {
    try {
      const res = await axios.delete(`/api/store/${store.slug}`);
      toast.success(res.data.success);
      setTimeout(() => {
        window.location.assign(`/`);
      }, 1000);
      close();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const deletePackage = {
    confirmDelete: onDelete,
    headerDelete: " Delete Store?",
    descriptionDelete: `Deleting "${store.name}" will permanently remove it and all its content. This is irreversible.`,
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Header title="Settings" description="Manage your store" />
        <div className="flex gap-x-4">
          {isOwner && (
            <Button
              disabled={isLoading}
              variant={`destructive`}
              size={`sm`}
              onClick={() => open("confirmDelete", { ...deletePackage })}
            >
              Delete
              <Trash className="ml-2 h-4 w-4" />
            </Button>
          )}
          <Button
            className="ml-auto flex"
            size={"sm"}
            disabled={isLoading}
            type="submit"
            form="updateStoreForm"
          >
            Save changes
          </Button>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          id="updateStoreForm"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Store name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder={form
                        .watch("name")
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, "-")}
                    />
                  </FormControl>
                  <FormDescription className="text-xs italic">
                    Slug format: Alphanumeric characters, hyphens (-). Spaces
                    will be replaced with hyphens. Examples: "cool store" -&gt;
                    "cool-store".
                  </FormDescription>
                  {form.watch("slug") === "" && (
                    <FormDescription className="text-xs italic">
                      **Default Slug:** If you leave the slug field empty, a
                      slug will be generated automatically based on your store
                      name using the same format.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <Separator />
      <APIAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/store/${store.slug}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
