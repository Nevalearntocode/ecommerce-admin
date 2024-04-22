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
import { ClothingProduct, TechnologyProduct } from "@/types";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import APIAlert from "@/components/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductImage from "@/components/product-image";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import useModal from "@/hooks/use-modal-store";

type Props = {
  product: TechnologyProduct | null;
  categories:
    | {
        name: string;
      }[]
    | undefined;
  models:
    | {
        name: string;
      }[]
    | undefined;
  types:
    | {
        name: string;
      }[]
    | undefined;
};

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().transform((value) => value.trim().replace(/\s+/g, "-")),
  description: z.string().optional(),
  price: z.string(),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
  images: z.array(z.string()),
  brand: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  categoryName: z.string().min(1, "Category is required"),
  modelName: z.string().min(1, "Model is required"),
  typeName: z.string().min(1, "Type is required"),
});

type FormType = z.infer<typeof formSchema>;

const TechnologyProductForm = ({
  product,
  categories,
  types,
  models,
}: Props) => {
  const params = useParams();
  const origin = useOrigin();
  const router = useRouter();
  const { open, close } = useModal();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: "",
      stock: 0,
      images: [],
      brand: "",
      isFeatured: false,
      isArchived: false,
      categoryName: "",
      modelName: "",
      typeName: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.setValue("name", product.name || "");
      form.setValue("description", product.description || "");
      form.setValue("price", product.price.toString() || ""); // Assuming price is a number, convert to string
      form.setValue("stock", product.stock || 0);
      form.setValue("images", product.images || []);
      form.setValue("brand", product.brand || "");
      form.setValue("isFeatured", product.isFeatured || false);
      form.setValue("isArchived", product.isArchived || false);

      // Access nested properties for category, model, and type
      form.setValue("categoryName", product.category.name || "");
      form.setValue("modelName", product.model?.name || "");
      form.setValue("typeName", product.type?.name || "");
    }
  }, [product]);

  const onChange = (value: string, state: "upload" | "remove") => {
    const currentImages = form.getValues("images") || []; // Get current images array

    if (state === "upload") {
      form.setValue("images", [...currentImages, value]); // Append new value
    } else if (state === "remove") {
      const indexToRemove = currentImages.indexOf(value);
      if (indexToRemove > -1) {
        const updatedImages = [...currentImages];
        updatedImages.splice(indexToRemove, 1);
        form.setValue("images", updatedImages); // Remove value if found
      }
    }
  };

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    if (!parseFloat(data.price)) {
      toast.info("Product price need to be a number.");
      return;
    }
    if (data.images.length === 0) {
      toast.info("You need at least 1 image for your product.");
      return;
    }
    try {
      if (product) {
        await axios
          .patch(
            `/api/store/${params.storeSlug}/products/${product.slug}`,
            data,
          )
          .then((res) => {
            form.resetField("name");
            form.resetField("price");
            form.resetField("stock");
            form.resetField("brand");
            form.resetField("description");
            form.resetField("images");

            toast.success(res.data.success);
            router.push(
              `/${params.storeSlug}/products/${data.name.toLowerCase().trim().replace(/\s+/g, "-")}`,
            );
            router.refresh();
          });
      } else {
        await axios
          .post(`/api/store/${params.storeSlug}/products`, data)
          .then((res) => {
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
        `/api/store/${params.storeSlug}/products/${product?.slug}`,
      );
      toast.success(res.data.success);
      router.push(`/${params.storeSlug}/products`);
      router.refresh();
      close();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const deletePackage = {
    confirmDelete: onDelete,
    headerDelete: " Delete product?",
    descriptionDelete: `"${product?.name}" Will permanently be removed. This is irreversible.`,
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="block">
          <Header
            title={
              product ? `Manage ${product.name} Product` : "Create new product"
            }
            description="Create or manage your product"
          />
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          id="productForm"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  {form.watch("name") != "" && (
                    <FormDescription className="text-xs italic">
                      We'll create a slug from product name for you. (
                      {form
                        .watch("name")
                        .trim()
                        .replace(/\s+/g, "-")
                        .toLowerCase()}
                      )
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormDescription className="text-xs italic">
                    Brand will be saved as lowercase for SEO purpose.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
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
                      {types?.map(({ name }) => (
                        <SelectItem value={name} key={name}>
                          {name[0].toUpperCase() + name.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
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
                      {models?.map(({ name }) => (
                        <SelectItem value={name} key={name}>
                          {name[0].toUpperCase() + name.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                      {categories?.map(({ name }) => (
                        <SelectItem value={name} key={name}>
                          {name[0].toUpperCase() + name.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-3">
                  <FormLabel>Featured</FormLabel>
                  <div className="flex h-full items-start gap-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <p className="mt-[2px] text-sm font-light italic">
                      This product will be appear on your store with higher
                      priority.
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-3">
                  <FormLabel>Archive</FormLabel>
                  <div className="flex h-full items-start gap-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <p className="mt-[2px] text-sm font-light italic">
                      If you are currently out of stock or don't want your
                      product to be appeared anywhere.
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="" disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-y-2 md:col-span-2 lg:col-span-3">
              <FormLabel className="flex items-center">
                Product Images
                <span className="ml-4 text-xs font-light italic">
                  (We'll show you a preview of your images after upload. Make
                  sure it fills the preview area for an optimal view.)
                </span>
              </FormLabel>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormControl>
                        <ProductImage
                          endpoint="productImage"
                          onUpload={(value) => onChange(value, "upload")}
                          onRemove={(value) => onChange(value, "remove")}
                          value={field.value[0]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("images").length > 0 && (
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormControl>
                          <ProductImage
                            endpoint="productImage"
                            onUpload={(value) => onChange(value, "upload")}
                            onRemove={(value) => onChange(value, "remove")}
                            value={field.value[1]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {form.watch("images").length > 1 && (
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormControl>
                          <ProductImage
                            endpoint="productImage"
                            onUpload={(value) => onChange(value, "upload")}
                            onRemove={(value) => onChange(value, "remove")}
                            value={field.value[2]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-x-8 md:justify-end lg:hidden">
            {product && (
              <Button
                className="h-10 w-32"
                disabled={isLoading}
                variant={`destructive`}
                size={`sm`}
                onClick={(e) => {
                  e.preventDefault();
                  open("confirmDelete", { ...deletePackage });
                }}
              >
                Delete
                <Trash className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Button className="flex h-10 w-32">
              {product ? "Save changes" : "Save"}
            </Button>
          </div>
        </form>
      </Form>
      <Separator />
      {product && (
        <>
          <APIAlert
            title={"GET"}
            description={`${origin}/api/store/${params.storeSlug}/products/${product ? product.slug : ``}`}
            variant="public"
          />
          <APIAlert
            title={"DELETE"}
            description={`${origin}/api/store/${params.storeSlug}/products/${product ? product.slug : ``}`}
            variant="staff"
          />
        </>
      )}
      <APIAlert
        title={product ? "PATCH" : "POST"}
        description={`${origin}/api/store/${params.storeSlug}/products/${product ? product.slug : ``}`}
        variant="staff"
      />
    </>
  );
};

export default TechnologyProductForm;
