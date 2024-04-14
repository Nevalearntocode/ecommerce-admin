"use client";

import React from "react";
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

type Props = {};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").trim(),
  slug: z.string(),
  type: z.nativeEnum(StoreType),
});

type FormType = z.infer<typeof formSchema>;

const CreateStoreModal = (props: Props) => {
  const { isOpen, close, type } = useModal();
  const isModalOpen = type === "createStore" && isOpen;

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      type: StoreType.CLOTHING,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    console.log(data);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader className="text-xl font-bold">
          Create your new store
        </DialogHeader>
        <DialogDescription className="w-full text-center italic">
          Choose your store type and name.
        </DialogDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    Default slug
                  </FormDescription>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={form
                        .watch("name")
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, "-")}
                    />
                  </FormControl>
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
                          {type[0].toUpperCase() + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoreModal;
