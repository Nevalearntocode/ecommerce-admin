"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dialog, DialogContent } from "../ui/dialog";
import useModal from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

type Props = {};

const formSchema = z.object({
  isAdmin: z.boolean().default(false),
  canManageStore: z.boolean().default(false),
  canManageCategory: z.boolean().default(true),
  canManageBillboard: z.boolean().default(true),
  canManageProduct: z.boolean().default(true),
});

type FormType = z.infer<typeof formSchema>;

const UpdateRoleModal = (props: Props) => {
  const router = useRouter();
  const params = useParams();
  const { close, data, isOpen, type } = useModal();
  const isModalOpen = type === "updateRole" && isOpen;
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  useEffect(() => {
    if (data && data.staff) {
      form.setValue("isAdmin", data.staff.isAdmin);
      form.setValue("canManageStore", data.staff.canManageStore);
      form.setValue("canManageCategory", data.staff.canManageCategory);
      form.setValue(
        "canManageBillboard",
        data.staff.canManageBillboard || false,
      );
      form.setValue("canManageProduct", data.staff.canManageProduct);
    }
  }, [data, form]);

  if (!data || !data.staff) {
    return null;
  }

  const { staff, isOwner } = data;

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: FormType) => {
    try {
      const res = await axios.patch(
        `/api/store/${params.storeSlug}/staffs/${staff.id}`,
        data,
      );
      toast.success(res.data.success);
      router.refresh();
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div>
              <h3 className="mb-4 text-lg font-medium">
                Manage staff{" "}
                {staff.user.name === "" ? staff.user.email : staff.user.name}{" "}
                roles{" "}
              </h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="canManageProduct"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Manage Products
                        </FormLabel>
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-red-100 p-2 text-red-700">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Manage stores (Caution!)
                        </FormLabel>
                        <FormDescription>
                          Edit stores and grant all access from previous roles.
                        </FormDescription>
                        <FormDescription>
                          !! Allows permanent deletion of categories.
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
                {isOwner && (
                  <FormField
                    control={form.control}
                    name="isAdmin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border bg-red-100 p-2 text-red-700">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Admin (Caution!)
                          </FormLabel>
                          <FormDescription>
                            Grant full access + manage staffs
                          </FormDescription>
                          <FormDescription>
                            !! Allows permanent deletion of categories.
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
                className="ml-auto flex"
                disabled={isLoading}
              >
                Confirm
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRoleModal;
