"use client";

import React, { useEffect } from "react";
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
import { Store } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Props = {
  store: Store;
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").trim(),
  slug: z.string().transform((value) => value.trim().replace(/\s+/g, "-")),
});

type FormType = z.infer<typeof formSchema>;

const SettingsForm = ({ store }: Props) => {
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
    console.log(data);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Header title="Settings" description="Manage your store" />
        <Button variant={`destructive`} size={`sm`}>
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Button className="" disabled={isLoading}>
            Save changes
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SettingsForm;
