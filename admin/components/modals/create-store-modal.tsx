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
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long").trim(),
  slug: z.string().transform((value) => value.trim().replace(/\s+/g, "-")),
  type: z.nativeEnum(StoreType),
});

type FormType = z.infer<typeof formSchema>;

const CreateStoreModal = (props: Props) => {
  const { isOpen, close, type } = useModal();
  const isModalOpen = type === "createStore" && isOpen;
  const router = useRouter();
  // const refetchStores = useStore((state) => state.refetchStores);

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
    try {
      const res = await axios.post(`/api/store`, data);
      form.reset();
      router.refresh();
      window.location.assign(
        `/${data.slug !== "" ? data.slug : data.name.toLowerCase().trim().replace(/\s+/g, "-")}`,
      );
      close();
      // refetchStores();
      toast.success(res.data.success);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent className="w-[90%]">
        <DialogHeader className="text-xl font-bold">
          Create your new store
          <DialogDescription className="w-full text-center text-sm font-light italic">
            Choose your store type and name.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
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
                    Slug format: Alphanumeric characters, hyphens (-). Spaces
                    will be replaced with hyphens. Examples: "cool store" -&gt;
                    "cool-store".
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
                      slug will be generated automatically based on your store
                      name using the same format.
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
                          {type[0].toUpperCase() + type.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 w-full">
              <Button className="w-full" disabled={isLoading}>
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoreModal;
