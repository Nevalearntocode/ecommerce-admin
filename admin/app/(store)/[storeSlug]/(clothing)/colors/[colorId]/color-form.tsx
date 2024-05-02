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
import { Color } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import APIAlert from "@/components/apis/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import { toast } from "sonner";
import axios from "axios";
import useModal from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";
import FormHeader from "@/components/forms/form-header";

type Props = {
  color: Color | null;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name needs at least 2 characters" }),
  value: z.string().regex(/^#?([0-9A-F]{3}){1,2}$/i, {
    message: "Please follow the format above when choosing color.",
  }),
});

type FormType = z.infer<typeof formSchema>;

const ColorForm = ({ color }: Props) => {
  const { open, close } = useModal();
  const origin = useOrigin();
  const router = useRouter();
  const params = useParams();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "",
    },
  });

  useEffect(() => {
    if (color) {
      form.setValue("name", color.name);
      form.setValue("value", color.value);
    }
  }, [color, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    if (color && color.name === data.name && color.value === data.value) {
      toast.info("Color has not changed.");
      return;
    }
    try {
      if (color) {
        await axios
          .patch(`/api/store/${params.storeSlug}/colors/${color.id}`, data)
          .then((res) => {
            form.reset();
            toast.success(res.data.success);
            router.refresh();
          });
      } else {
        await axios
          .post(`/api/store/${params.storeSlug}/colors`, data)
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
        `/api/store/${params.storeSlug}/colors/${color?.id}`,
      );
      toast.success(res.data.success);
      router.push(`/${params.storeSlug}/colors`);
      router.refresh();
      close();
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const deletePackage = {
    confirmDelete: onDelete,
    headerDelete: " Delete color?",
    descriptionDelete: `Deleting "${color?.name}" will permanently remove it and all its content. This is irreversible.`,
  };

  return (
    <>
      <FormHeader
        title={color ? `Manage ${color.name} Color` : "Create new color"}
        description="Create or manage your colors"
        isLoading={isLoading}
        isEditing={!!color}
        onDelete={() => open("confirmDelete", { ...deletePackage })}
        onSubmit={form.handleSubmit(onSubmit)}
      />
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          id="colorForm"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Color name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="col-span-2">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem className="flex gap-x-4">
                    <div className="mt-1 flex w-1/2 flex-col gap-y-2">
                      <FormLabel>Color value</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center gap-x-4">
                          <Input
                            disabled={isLoading}
                            {...field}
                            placeholder={`#1F1F1F`}
                          />
                          <div
                            className="rounded-full border bg-[#1f1f1f] p-4"
                            style={{ backgroundColor: field.value }}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs italic">
                        Hex Color Format: Starts with a "#" followed by 3 or 6
                        characters. Allowed characters are 0-9 and A-F
                        (case-insensitive). Examples: "#F00" (red), "#FF0000"
                        (red), "#008000" (green).
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
      <Separator />
      {color && (
        <>
          <APIAlert
            title={"GET"}
            description={`${origin}/api/store/${params.storeSlug}/colors/${color ? color.id : ``}`}
            variant="public"
          />
          <APIAlert
            title={"DELETE"}
            description={`${origin}/api/store/${params.storeSlug}/colors/${color ? color.id : ``}`}
            variant="staff"
          />
        </>
      )}
      <APIAlert
        title={color ? "PATCH" : "POST"}
        description={`${origin}/api/store/${params.storeSlug}/colors/${color ? color.id : ``}`}
        variant="staff"
      />
    </>
  );
};

export default ColorForm;
