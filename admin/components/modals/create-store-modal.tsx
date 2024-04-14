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
import { Form } from "../ui/form";
import useModal from "@/hooks/use-modal-store";

type Props = {};

const formSchema = z.object({});

type FormType = z.infer<typeof formSchema>;

const CreateStoreModal = (props: Props) => {
  const { isOpen, close, type } = useModal();
  const isModalOpen = type === "createStore" && isOpen;

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
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
          <form onSubmit={form.handleSubmit(onSubmit)}></form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateStoreModal;
