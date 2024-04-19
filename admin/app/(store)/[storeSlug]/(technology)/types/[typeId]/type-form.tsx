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
import { Type } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import APIAlert from "@/components/api-alert";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { useOrigin } from "@/hooks/use-origin";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import useModal from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";

type Props = {
  type: Type | null;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name needs at least 2 characters" }),
  value: z
    .string()
    .min(2, { message: "Type value needs at least 2 characters" }),
});

type FormType = z.infer<typeof formSchema>;

const TypeForm = ({ type }: Props) => {
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
    if (type) {
      form.setValue("name", type.name);
      form.setValue("value", type.value);
    }
  }, [type]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    console.log(data);
    if (type && type.name === data.name && type.value === data.value) {
      toast.info("Type has not changed.");
      return;
    }
    try {
      if (type) {
        await axios
          .patch(`/api/store/${params.storeSlug}/types/${type.id}`, data)
          .then((res) => {
            form.reset();
            toast.success(res.data.success);
            router.refresh();
          });
      } else {
        await axios
          .post(`/api/store/${params.storeSlug}/types`, data)
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
        `/api/store/${params.storeSlug}/types/${type?.id}`,
      );
      toast.success(res.data.success);
      router.push(`/${params.storeSlug}/types`);
      router.refresh();
      close();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const deletePackage = {
    confirmDelete: onDelete,
    headerDelete: " Delete type?",
    descriptionDelete: `Deleting "${type?.name}" will permanently remove it and all its content. This is irreversible.`,
  };

  return (
    <>
      <div className="flex items-center justify-end md:justify-between">
        <div className="hidden md:block">
          <Header
            title={type ? `Manage ${type.name} Type` : "Create new type"}
            description="Create or manage your product types"
          />
        </div>
        <div className="flex gap-x-4">
          {type && (
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
            form="typeForm"
          >
            {type ? "Save changes" : "Save"}
          </Button>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          id="typeForm"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Type name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder="Laptop"
                    />
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
                      <FormLabel>Type value</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center gap-x-4">
                          <Input
                            disabled={isLoading}
                            {...field}
                            placeholder={"Gaming Laptop"}
                          />
                        </div>
                      </FormControl>
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
      {type && (
        <>
          <APIAlert
            title={"GET"}
            description={`${origin}/api/store/${params.storeSlug}/types/${type ? type.id : ``}`}
            variant="public"
          />
          <APIAlert
            title={"DELETE"}
            description={`${origin}/api/store/${params.storeSlug}/types/${type ? type.id : ``}`}
            variant="staff"
          />
        </>
      )}
      <APIAlert
        title={type ? "PATCH" : "POST"}
        description={`${origin}/api/store/${params.storeSlug}/types/${type ? type.id : ``}`}
        variant="staff"
      />
    </>
  );
};

export default TypeForm;
