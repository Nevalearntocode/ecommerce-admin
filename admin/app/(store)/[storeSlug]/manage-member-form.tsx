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
} from "@/components/ui/form";
import { StaffWithProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

type Props = {
  staff: StaffWithProfile;
  storeUserId: string;
};

const formSchema = z.object({
  isAdmin: z.boolean().default(false),
  canManageStore: z.boolean().default(false),
  canManageCategory: z.boolean().default(true),
  canManageBillboard: z.boolean().default(true),
  canManageProduct: z.boolean().default(true),
});

type FormType = z.infer<typeof formSchema>;

const ManageMemberForm = ({ staff, storeUserId }: Props) => {
  const router = useRouter();
  const params = useParams();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    form.setValue("isAdmin", staff.isAdmin);
    form.setValue("canManageStore", staff.canManageStore);
    form.setValue("canManageCategory", staff.canManageCategory);
    form.setValue("canManageBillboard", staff.canManageBillboard || false);
    form.setValue("canManageProduct", staff.canManageProduct);
  }, [staff, form]);

  const onSubmit = async (data: FormType) => {
    try {
      const res = await axios.patch(
        `/api/store/${params.storeSlug}/staff/${staff.id}`,
        data,
      );
      toast.success(res.data.success);
      router.refresh();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">
            Manage staff {staff.user.name} roles{" "}
          </h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="canManageProduct"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Manage Products</FormLabel>
                    <FormDescription>
                      Create, edit, and delete products.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canManageBillboard"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Manage Billboards
                    </FormLabel>
                    <FormDescription>
                      Create, edit, delete billboards.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canManageCategory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Manage Categories
                    </FormLabel>
                    <FormDescription>
                      Edit categories and grant all access to billboards,
                      products.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="canManageStore"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-red-100 p-4 text-red-700">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Manage stores (Caution!)
                    </FormLabel>
                    <FormDescription>
                      Edit stores and grant all access to categories,
                      billboards, products.
                    </FormDescription>
                    <FormDescription>
                      **Use with caution:** Allows permanent deletion of
                      categories.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {storeUserId === staff.userId && (
              <FormField
                control={form.control}
                name="isAdmin"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-red-100 p-4 text-red-700">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Admin (Caution!)
                      </FormLabel>
                      <FormDescription>Grant full access</FormDescription>
                      <FormDescription>
                        **Use with caution:** Allows permanent deletion of
                        categories.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>
        <div className="flex w-full">
          <Button
            type="submit"
            className="mr-auto flex"
            variant={`destructive`}
            onClick={(e) => {
              e.preventDefault();
              console.log("delete");
            }}
          >
            Remove staff
          </Button>
          <Button type="submit" className="ml-auto flex">
            Confirm
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ManageMemberForm;
