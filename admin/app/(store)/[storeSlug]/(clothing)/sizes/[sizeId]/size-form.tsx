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
import { Size, SizeValue } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import APIAlert from "@/components/apis/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import { toast } from "sonner";
import axios from "axios";
import useModal from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormHeader from "@/components/forms/form-header";
import { useStoreContext } from "@/contexts/store-context";

type Props = {};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name needs at least 2 characters" }),
  value: z.nativeEnum(SizeValue),
});

type FormType = z.infer<typeof formSchema>;

const SizeForm = ({}: Props) => {
  const { open, close } = useModal();
  const origin = useOrigin();
  const router = useRouter();
  const params = useParams();
  const { sizes } = useStoreContext().store;
  const size = sizes.find((size) => size.id === Number(params.sizeId));
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: SizeValue.M,
    },
  });

  useEffect(() => {
    if (size) {
      form.setValue("name", size.name);
      form.setValue("value", size.value);
    }
  }, [size, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    if (size && size.name === data.name && size.value === data.value) {
      toast.info("Size has not changed.");
      return;
    }
    try {
      if (size) {
        await axios
          .patch(`/api/store/${params.storeSlug}/sizes/${size.id}`, data)
          .then((res) => {
            form.reset();
            toast.success(res.data.success);
            router.refresh();
          });
      } else {
        await axios
          .post(`/api/store/${params.storeSlug}/sizes`, data)
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
        `/api/store/${params.storeSlug}/sizes/${size?.id}`,
      );
      toast.success(res.data.success);
      router.push(`/${params.storeSlug}/sizes`);
      router.refresh();
      close();
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const deletePackage = {
    confirmDelete: onDelete,
    headerDelete: " Delete size?",
    descriptionDelete: `Deleting "${size?.name}" will permanently remove it and all its content. This is irreversible.`,
  };

  return (
    <>
      <FormHeader
        title={size ? `Manage ${size.name} Size` : "Create new size"}
        description="Create or manage your sizes"
        isLoading={isLoading}
        isEditing={!!size}
        onDelete={() => open("confirmDelete", { ...deletePackage })}
        onSubmit={form.handleSubmit(onSubmit)}
      />
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          id="sizeForm"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex justify-between md:col-span-2 lg:col-span-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-3/4">
                    <FormLabel>Size name</FormLabel>
                    <FormControl>
                      <Input disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size value</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(SizeValue).map((size) => (
                          <SelectItem value={size} key={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
      <Separator />
      {size && (
        <>
          <APIAlert
            title={"GET"}
            description={`${origin}/api/store/${params.storeSlug}/sizes/${size ? size.id : ``}`}
            variant="public"
          />
          <APIAlert
            title={"DELETE"}
            description={`${origin}/api/store/${params.storeSlug}/sizes/${size ? size.id : ``}`}
            variant="staff"
          />
        </>
      )}
      <APIAlert
        title={size ? "PATCH" : "POST"}
        description={`${origin}/api/store/${params.storeSlug}/sizes/${size ? size.id : ``}`}
        variant="staff"
      />
    </>
  );
};

export default SizeForm;
