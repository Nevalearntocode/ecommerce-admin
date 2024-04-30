"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import useModal from "@/hooks/use-modal-store";

type Props = {
  entity: {
    name: string;
    id: number;
    isPaid: boolean;
  };
  endpoint: string;
};

const OrderCellAction = ({ entity, endpoint }: Props) => {
  const { open, close } = useModal();
  const router = useRouter();

  const onPaid = async () => {
    try {
      const url = `/api/store/${endpoint}/${entity.id}`;
      const res = await axios.patch(url, {});
      toast.success(res.data.success);
      router.refresh();
      close();
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const onDelete = async () => {
    try {
      const url = `/api/store/${endpoint}/${entity.id}`;
      const res = await axios.delete(url);
      toast.success(res.data.success);
      router.refresh();
      close();
    } catch (error: any) {
      toast.error(error.response.data);
    }
  };

  const deletePackage = {
    confirmDelete: onDelete,
    headerDelete: `Cancel order of ${entity.name}`,
    descriptionDelete:
      "Are you sure you want to cancel this order? You might want to confirm with your customer first.",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={`ghost`} className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      {!entity.isPaid ? (
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem onClick={onPaid}>
            <Check className="mr-2 h-4 w-4" />
            Mark as paid
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open("confirmDelete", { ...deletePackage })}
          >
            <X className="mr-2 h-4 w-4 text-rose-500" />
            Cancel
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => toast.info("This transaction is already done.")}
          >
            This transaction is already done.
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default OrderCellAction;
