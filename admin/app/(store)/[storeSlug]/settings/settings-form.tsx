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
import APIAlert from "@/components/apis/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import ImageUpload from "@/components/uploadthing/upload-image";
import { useStoreContext } from "@/contexts/store-context";
import { isOwner } from "@/permissions/permission-hierarchy";

type Props = {};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").trim(),
  slug: z.string().transform((value) => value.trim().replace(/\s+/g, "-")),
  image: z.string().min(1, "Store image can't be empty."),
});

type FormType = z.infer<typeof formSchema>;

const SettingsForm = ({}: Props) => {
  const { name, slug, image, id, userId } = useStoreContext().store;
  const { user } = useStoreContext();
  const { open, close } = useModal();
  const origin = useOrigin();
  const router = useRouter();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      image: "",
    },
  });

  useEffect(() => {
    form.setValue("name", name);
    form.setValue("slug", slug);
    form.setValue("image", image);
  }, [form, name, slug, image]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    if (data.name === name && data.slug === slug && data.image === image) {
      toast.info("Store has not changed.");
      return;
    }
    try {
      const res = await axios.patch(`/api/store/${slug}`, data);
      toast.success(res.data.success);
      router.push(`/${generateSlug({ ...data })}/settings`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const onDelete = async () => {
    try {
      const res = await axios.delete(`/api/store/${slug}`);
      toast.success(res.data.success);
      router.push(`/`);
      router.refresh();
      close();
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const deletePackage = {
    confirmDelete: onDelete,
    headerDelete: " Delete Store?",
    descriptionDelete: `Deleting "${name}" will permanently remove it and all its content. This is irreversible.`,
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Header title="Settings" description="Manage your store" />
        <div className="flex gap-x-4">
          {isOwner(user.id, userId) && (
            <Button
              className="h-10 w-32"
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
            className="ml-auto flex h-10 w-32"
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
          <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Store Image</FormLabel>
                    {!field.value && (
                      <FormDescription className="text-xs italic">
                        We'll show you a preview of your image after upload.
                        Make sure it fills the preview area for an optimal view.
                      </FormDescription>
                    )}
                    <FormControl>
                      <ImageUpload
                        endpoint="billboardImage"
                        type="billboard"
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
      <Separator />
      <APIAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/store/${slug}`}
        variant="public"
      />
      <APIAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/v2/stores/${id}`}
        variant="public"
      />
    </>
  );
};

export default SettingsForm;
