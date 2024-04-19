"use client";

import React from "react";
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
import { ClothingProduct } from "@/types";
import { useParams } from "next/navigation";
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

type Props = {
  product: ClothingProduct | null;
  categories:
    | {
        name: string;
      }[]
    | undefined;
  sizes:
    | {
        name: string;
      }[]
    | undefined;
  colors:
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
  images: z.array(z.string().url("Invalid image URL")),
  brand: z.string().optional(),
  isFeatured: z.boolean().optional(),
  categoryName: z.string().min(1, "Category is required"),
  sizeName: z.string().min(1, "Size is required"),
  colorName: z.string().min(1, "Color is required"),
});

type FormType = z.infer<typeof formSchema>;

const ClothingProductForm = ({ product, categories, colors, sizes }: Props) => {
  const params = useParams();
  const origin = useOrigin();

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
      categoryName: "",
      sizeName: "",
      colorName: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    if (!parseFloat(data.price)) {
      toast.info("Product price need to be a number.");
      return;
    }
    console.log(data);
  };

  return (
    <>
      <div className="flex items-center justify-end md:justify-between">
        <div className="hidden md:block">
          <Header
            title={
              product ? `Manage ${product.name} Product` : "Create new product"
            }
            description="Create or manage your product"
          />
        </div>
        <div className="flex gap-x-4">
          {product && (
            <Button
              className="md:h-10 md:w-32"
              disabled={isLoading}
              variant={`destructive`}
              size={`sm`}
              // onClick={() => open("confirmDelete", { ...deletePackage })}
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
            form="productForm"
          >
            {product ? "Save changes" : "Save"}
          </Button>
        </div>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          id="productForm"
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Product description</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Product price</FormLabel>
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
                  <FormLabel>Product stock</FormLabel>
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
                  <FormLabel>Product brand</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
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
                      {colors?.map(({ name }) => (
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
              name="sizeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
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
                      {sizes?.map(({ name }) => (
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
                <FormItem className="flex flex-col">
                  <FormLabel>Is featured.</FormLabel>
                  <div className="flex h-full items-center">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
      <Separator />
      {product && (
        <>
          <APIAlert
            title={"GET"}
            description={`${origin}/api/store/${params.storeSlug}/products/${product ? product.id : ``}`}
            variant="public"
          />
          <APIAlert
            title={"DELETE"}
            description={`${origin}/api/store/${params.storeSlug}/products/${product ? product.id : ``}`}
            variant="staff"
          />
        </>
      )}
      <APIAlert
        title={product ? "PATCH" : "POST"}
        description={`${origin}/api/store/${params.storeSlug}/products/${product ? product.id : ``}`}
        variant="staff"
      />
    </>
  );
};

export default ClothingProductForm;
