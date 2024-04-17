"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
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
  const { open } = useModal();
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
      console.log("called");
      form.setValue("name", billboard.name);
      form.setValue("image", billboard.image);
    }
  }, [billboard]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    try {
      const res = await axios.post(
        `/api/store/${params.storeSlug}/billboards`,
        data,
      );
      toast.success(res.data.success);
      router.push(`/${params.storeSlug}/billboards`);
      // setTimeout(() => {
      //   window.location.assign(`/${params.storeSlug}/billboards`);
      // }, 1000);
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const onDelete = async () => {
    try {
      const res = await axios.delete(`/api/store/`);
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
    headerDelete: " Delete billboard?",
    descriptionDelete: `Deleting "${billboard?.name}" will permanently remove it and all its content. This is irreversible.`,
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Header
          title={
            billboard
              ? `Manage ${billboard.name} billboard`
              : "Create new billboard"
          }
          description="Create or manage your billboard"
        />
        <div className="flex gap-x-4">
          <Button
            disabled={isLoading}
            variant={`destructive`}
            size={`sm`}
            onClick={() => open("confirmDelete", { ...deletePackage })}
          >
            Delete
            <Trash className="ml-2 h-4 w-4" />
          </Button>
          <Button
            className="ml-auto flex"
            size={"sm"}
            disabled={isLoading}
            type="submit"
            form="billboardForm"
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
          id="billboardForm"
        >
          <div className="grid grid-cols-3 gap-8">
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
                  <FormItem>
                    <FormLabel>Billboard Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        endpoint="profileImage"
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
        description={`${origin}/api/store/`}
        variant="public"
      />
    </>
  );
};

export default BillboardForm;
