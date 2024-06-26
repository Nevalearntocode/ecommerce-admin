"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import useModal from "@/hooks/use-modal-store";
import { Button } from "../ui/button";

type Props = {};

const ConfirmDeleteModal = (props: Props) => {
  const { close, type, data, isOpen } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen = type === "confirmDelete" && isOpen;
  if (
    !data ||
    !data.descriptionDelete ||
    !data.headerDelete ||
    !data.confirmDelete
  ) {
    return null;
  }

  const { confirmDelete } = data;

  const onDelete = async () => {
    setIsLoading(true);
    confirmDelete();
    setIsLoading(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader className="text-xl font-bold">
          {data.headerDelete}
        </DialogHeader>
        <DialogDescription className="text-center">
          {data.descriptionDelete}
        </DialogDescription>
        <div className="mt-4 flex w-full justify-between">
          <Button
            disabled={isLoading}
            className="w-1/3"
            variant={`default`}
            onClick={close}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            className="w-1/3"
            variant={`destructive`}
            onClick={onDelete}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteModal;
