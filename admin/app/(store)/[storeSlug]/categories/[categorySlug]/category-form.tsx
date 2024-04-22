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
import { Category } from "@prisma/client";
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
import { generateSlug } from "@/constant";
import FormHeader from "@/components/forms/form-header";

type Props = {
  category:
    | (Category & {
        billboard: {
          name: string;
        };
      })
    | null;
  billboardNames: {
    name: string;
  }[];
};

const formSchema = z.object({
  name: z.string().min(2, { message: "Name needs at least 2 characters" }),
  slug: z.string().transform((value) => value.trim().replace(/\s+/g, "-")),
  billboardName: z.string().min(1, {
    message: "Choose at least 1 billboard for category representation.",
  }),
});

type FormType = z.infer<typeof formSchema>;

const CategoryForm = ({ category, billboardNames }: Props) => {
  const { open, close } = useModal();
  const origin = useOrigin();
  const router = useRouter();
  const params = useParams();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      billboardName: "",
    },
  });

  useEffect(() => {
    if (category) {
      form.setValue("name", category.name);
      form.setValue("slug", category.slug);
      form.setValue("billboardName", category.billboard.name);
    }
  }, [category]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    if (
      category &&
      category.name === data.name &&
      category.slug === data.slug &&
      category.billboard.name === data.billboardName
    ) {
      toast.info("Category has not changed.");
      return;
    }
    try {
      if (category) {
        await axios
          .patch(
            `/api/store/${params.storeSlug}/categories/${category.slug}`,
            data,
          )
          .then((res) => {
            form.reset();
            toast.success(res.data.success);
            router.push(
              `/${params.storeSlug}/categories/${generateSlug({ ...data })}`,
            );
            router.refresh();
          });
      } else {
        await axios
          .post(`/api/store/${params.storeSlug}/categories`, data)
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
        `/api/store/${params.storeSlug}/categories/${category?.slug}`,
      );
      toast.success(res.data.success);
      router.push(`/${params.storeSlug}/categories`);
      router.refresh();
      close();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const deletePackage = {
    confirmDelete: onDelete,
    headerDelete: " Delete category?",
    descriptionDelete: `Deleting "${category?.name}" will permanently remove it and all its content. This is irreversible.`,
  };

  return (
    <>
      <FormHeader
        title={
          category ? `Manage ${category.name} Category` : "Create new category"
        }
        description="Create or manage your categories"
        isLoading={isLoading}
        isEditing={!!category}
        onDelete={() => open("confirmDelete", { ...deletePackage })}
        onSubmit={form.handleSubmit(onSubmit)}
      />
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          id="categoryForm"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="col-span-3 grid w-full grid-cols-1 gap-8 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Category name</FormLabel>
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
                    <FormDescription className="text-xs italic">
                      Slug format: Alphanumeric characters, hyphens (-). Spaces
                      will be replaced with hyphens. Examples: "cool store"
                      -&gt; "cool-store".
                    </FormDescription>
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
                name="billboardName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billboard</FormLabel>
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
                        {billboardNames.map(({ name }) => (
                          <SelectItem value={name} key={name}>
                            {name[0].toUpperCase() +
                              name.slice(1).toLowerCase()}
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
      {category && (
        <>
          <APIAlert
            title={"GET"}
            description={`${origin}/api/store/${params.storeSlug}/categories/${category ? category.slug : ``}`}
            variant="public"
          />
          <APIAlert
            title={"DELETE"}
            description={`${origin}/api/store/${params.storeSlug}/categories/${category ? category.slug : ``}`}
            variant="staff"
          />
        </>
      )}
      <APIAlert
        title={category ? "PATCH" : "POST"}
        description={`${origin}/api/store/${params.storeSlug}/categories/${category ? category.slug : ``}`}
        variant="staff"
      />
    </>
  );
};

export default CategoryForm;
