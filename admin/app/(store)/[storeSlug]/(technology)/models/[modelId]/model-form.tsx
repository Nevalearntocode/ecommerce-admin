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
import { Separator } from "@/components/ui/separator";
import APIAlert from "@/components/apis/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import { toast } from "sonner";
import axios from "axios";
import useModal from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";
import FormHeader from "@/components/forms/form-header";
import { useStoreContext } from "@/contexts/store-context";

type Props = {};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name needs at least 2 characters" }),
  value: z
    .string()
    .min(2, { message: "Model value needs at least 2 characters" }),
});

type FormType = z.infer<typeof formSchema>;

const ModelForm = ({}: Props) => {
  const { models } = useStoreContext().store;
  const { open, close } = useModal();
  const origin = useOrigin();
  const router = useRouter();
  const params = useParams();
  const model = models.find((model) => model.id === Number(params.modelId));

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
  }, [model, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
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
      <FormHeader
        title={model ? `Manage ${model.name} Model` : "Create new model"}
        description="Create or manage your models"
        isLoading={isLoading}
        isEditing={!!model}
        onDelete={() => open("confirmDelete", { ...deletePackage })}
        onSubmit={form.handleSubmit(onSubmit)}
      />
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
                      <FormLabel>Model value</FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center gap-x-4">
                          <Input disabled={isLoading} {...field} />
                        </div>
                      </FormControl>
                      <FormDescription className="text-xs italic">
                        A brief description about this model.
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
