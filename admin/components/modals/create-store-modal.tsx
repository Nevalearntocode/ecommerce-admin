"use client";

import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import useModal from "@/hooks/use-modal-store";
import { StoreType } from "@prisma/client";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { generateSlug } from "@/constant";
import { cn } from "@/lib/utils";
import ImageUpload from "../uploadthing/upload-image";

type Props = {};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").trim(),
  slug: z.string().transform((value) => value.trim().replace(/\s+/g, "-")),
  image: z.string(),
  type: z.nativeEnum(StoreType),
});

type FormType = z.infer<typeof formSchema>;

enum STEPS {
  INFO = 1,
  IMAGE = 2,
}

const CreateStoreModal = (props: Props) => {
  const { isOpen, close, type } = useModal();
  const isModalOpen = type === "createStore" && isOpen;
  const router = useRouter();

  const [step, setStep] = useState<STEPS>(STEPS.INFO);

  const onBack = () => {
    setStep(STEPS.INFO);
  };

  const onNext = () => {
    setStep(STEPS.IMAGE);
  };

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      image: "",
      type: StoreType.CLOTHING,
    },
  });

  const isLoading = form.formState.isSubmitting;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  const onSubmit = async (data: FormType) => {
    if(data.image === ""){
      toast.error(`Please upload an image for your store.`)
      return;
    }
    try {
      const res = await axios.post(`/api/store`, data);
      form.reset();
      router.push(`/${generateSlug({ ...data })}`);
      router.refresh();
      close();
      toast.success(res.data.success);
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent className="w-[90%]">
        <DialogHeader className="text-xl font-bold">
          Create your new store
          <DialogDescription className="w-full text-center text-sm font-light italic">
            Choose your store type, name and image.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-full flex-col gap-y-2"
          >
            {step === STEPS.INFO && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
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
                      <FormDescription className="text-xs italic">
                        Slug format: Alphanumeric characters, hyphens (-).
                        Spaces will be replaced with hyphens. Examples: "cool
                        store" -&gt; "cool-store".
                      </FormDescription>
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
                      {form.watch("slug") === "" && (
                        <FormDescription className="text-xs italic">
                          **Default Slug:** If you leave the slug field empty, a
                          slug will be generated automatically based on your
                          store name using the same format.
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What does you store sell?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(StoreType).map((type) => (
                            <SelectItem value={type} key={type}>
                              {type[0].toUpperCase() +
                                type.slice(1).toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {step === STEPS.IMAGE && (
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
                          Make sure it fills the preview area for an optimal
                          view.
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
                      {hasErrors && (
                        <p className="text-rose-500 dark:text-rose-900">
                          Please fill all {field.value ? "previous " : "the "}
                          fields before submiting.
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div className="mt-4 flex w-full items-center justify-between">
              {step === STEPS.IMAGE && (
                <Button
                  variant={`outline`}
                  className={cn("flex w-full", step === STEPS.IMAGE && "w-1/3")}
                  onClick={(e) => {
                    e.preventDefault();
                    onBack();
                  }}
                >
                  Back
                </Button>
              )}
              <Button
                className={cn(
                  "ml-auto flex w-full",
                  step === STEPS.IMAGE && "w-1/3",
                )}
                disabled={isLoading}
                onClick={
                  step === STEPS.INFO
                    ? (e) => {
                        e.preventDefault();
                        onNext();
                      }
                    : () => {}
                }
              >
                {step === STEPS.INFO ? "Next" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoreModal;
