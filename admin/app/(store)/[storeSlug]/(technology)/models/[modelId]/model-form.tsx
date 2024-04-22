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
import { Model } from "@prisma/client";
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
  model: Model | null;
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name needs at least 2 characters" }),
  value: z
    .string()
    .min(2, { message: "Model value needs at least 2 characters" }),
});

type FormType = z.infer<typeof formSchema>;

const ModelForm = ({ model }: Props) => {
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
    if (model) {
      form.setValue("name", model.name);
      form.setValue("value", model.value);
    }
  }, [model]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    console.log(data);
    if (model && model.name === data.name && model.value === data.value) {
      toast.info("Model has not changed.");
      return;
    }
    try {
      if (model) {
        await axios
          .patch(`/api/store/${params.storeSlug}/models/${model.id}`, data)
          .then((res) => {
            form.reset();
            toast.success(res.data.success);
            router.refresh();
          });
      } else {
        await axios
          .post(`/api/store/${params.storeSlug}/models`, data)
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
        `/api/store/${params.storeSlug}/models/${model?.id}`,
      );
      toast.success(res.data.success);
      router.push(`/${params.storeSlug}/models`);
      router.refresh();
      close();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const deletePackage = {
    confirmDelete: onDelete,
    headerDelete: " Delete model?",
    descriptionDelete: `Deleting "${model?.name}" will permanently remove it and all its content. This is irreversible.`,
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Header
            title={model ? `Manage ${model.name} Model` : "Create new model"}
            description="Create or manage your product models"
          />
        </div>
        <div className="flex gap-x-4">
          {model && (
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
            form="modelForm"
          >
            {model ? "Save changes" : "Save"}
          </Button>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          id="modelForm"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Model name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      placeholder="ASUS Zenbook Pro 14 Duo OLED (UX8402)"
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
                      <FormLabel>Model value</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center gap-x-4">
                          <Input
                            disabled={isLoading}
                            {...field}
                            placeholder={"i7-12700H/RTX3050Ti/16GB/1TB"}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Please enter key specifications separated by slashes,
                        for example: Processor/Graphics Card/RAM/Storage (e.g.,
                        i7-12700H/RTX3050Ti/16GB/1TB).
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
      {model && (
        <>
          <APIAlert
            title={"GET"}
            description={`${origin}/api/store/${params.storeSlug}/models/${model ? model.id : ``}`}
            variant="public"
          />
          <APIAlert
            title={"DELETE"}
            description={`${origin}/api/store/${params.storeSlug}/models/${model ? model.id : ``}`}
            variant="staff"
          />
        </>
      )}
      <APIAlert
        title={model ? "PATCH" : "POST"}
        description={`${origin}/api/store/${params.storeSlug}/models/${model ? model.id : ``}`}
        variant="staff"
      />
    </>
  );
};

export default ModelForm;
