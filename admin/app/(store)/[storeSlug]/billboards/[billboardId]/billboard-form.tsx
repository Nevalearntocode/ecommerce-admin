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
import { Billboard } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import APIAlert from "@/components/api-alert";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { useOrigin } from "@/hooks/use-origin";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import useModal from "@/hooks/use-modal-store";
import ImageUpload from "@/components/upload-image";
import { useParams, useRouter } from "next/navigation";

type Props = {
  billboard: Billboard | null;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name needs at least 2 characters" }),
  image: z.string(),
});

type FormType = z.infer<typeof formSchema>;

const BillboardForm = ({ billboard }: Props) => {
  const { open, close } = useModal();
  const origin = useOrigin();
  const router = useRouter();
  const params = useParams();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  useEffect(() => {
    if (billboard) {
      form.setValue("name", billboard.name);
      form.setValue("image", billboard.image);
    }
  }, [billboard]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    if (
      billboard &&
      billboard.name === data.name &&
      billboard.image === data.image
    ) {
      toast.info("Billboard has not changed.");
      return;
    }
    try {
      if (billboard) {
        await axios
          .patch(
            `/api/store/${params.storeSlug}/billboards/${billboard.id}`,
            data,
          )
          .then((res) => {
            form.reset();
            toast.success(res.data.success);
            router.refresh();
          });
      } else {
        await axios
          .post(`/api/store/${params.storeSlug}/billboards`, data)
          .then((res) => {
            form.reset();
            toast.success(res.data.success);
            router.refresh();
          });
      }
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const onDelete = async () => {
    try {
      const res = await axios.delete(
        `/api/store/${params.storeSlug}/billboards/${billboard?.id}`,
      );
      toast.success(res.data.success);
      router.push(`/${params.storeSlug}/billboards`);
      router.refresh();
      close();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const deletePackage = {
    confirmDelete: onDelete,
    headerDelete: " Delete billboard?",
    descriptionDelete: `Deleting "${billboard?.name}" will permanently remove it and all its content. This is irreversible.`,
  };

  return (
    <>
      <div className="flex items-center justify-end md:justify-between">
        <div className="hidden md:block">
          <Header
            title={
              billboard
                ? `Manage ${billboard.name} Billboard`
                : "Create new billboard"
            }
            description="Create or manage your billboard"
          />
        </div>
        <div className="flex gap-x-4">
          {billboard && (
            <Button
              className="md:h-10 md:w-32"
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
            className="ml-auto flex md:h-10 md:w-32"
            size={"sm"}
            disabled={isLoading}
            type="submit"
            form="billboardForm"
          >
            {billboard ? "Save changes" : "Save"}
          </Button>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          id="billboardForm"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Billboard name</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Billboard Image</FormLabel>
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
      {billboard && (
        <>
          <APIAlert
            title={"GET"}
            description={`${origin}/api/store/${params.storeSlug}/billboards/${billboard ? billboard.id : ``}`}
            variant="public"
          />
          <APIAlert
            title={"DELETE"}
            description={`${origin}/api/store/${params.storeSlug}/billboards/${billboard ? billboard.id : ``}`}
            variant="staff"
          />
        </>
      )}
      <APIAlert
        title={billboard ? "PATCH" : "POST"}
        description={`${origin}/api/store/${params.storeSlug}/billboards/${billboard ? billboard.id : ``}`}
        variant="staff"
      />
    </>
  );
};

export default BillboardForm;
