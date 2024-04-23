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
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import useModal from "@/hooks/use-modal-store";

type Props = {
  entity: {
    name?: string;
    phone?: string;
    id?: number;
    slug?: string;
  };
  endpoint: string;
  type?: "general" | "product";
};

const EntityCellAction = ({ entity, endpoint, type }: Props) => {
  const { open, close } = useModal();
  const router = useRouter();
  const params = useParams();

  const onCopy = () => {
    const valueToCopy = entity.id?.toString() || entity.slug;
    if (valueToCopy) {
      navigator.clipboard.writeText(valueToCopy);
      toast.success(`${entity.id ? "ID" : "Slug"} copied to clipboard.`);
    }
  };

  const onDelete = async () => {
    try {
      const url = `/api/store/${params.storeSlug}/${endpoint}/${entity.id || entity.slug}`;
      const res = await axios.delete(url);
      toast.success(res.data.success);
      router.refresh();
      close();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data);
    }
  };

  const description =
    type === "general"
      ? `Deleting "${entity.name}" will permanently remove it and all its content. This is irreversible.`
      : type === "product"
        ? `"${entity.name}" Will permanently be removed. This is irreversible.`
        : `Order "${entity.id}" will be permanently deleted. Make sure all transactions are being done.`;

  const deletePackage = {
    confirmDelete: onDelete,
    headerDelete: `Delete ${entity.id ? "billboard" : "category"}?`,
    descriptionDelete: description,
  };

  const editUrl = `/${params.storeSlug}/${endpoint}/${entity.id || entity.slug}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={`ghost`} className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Action</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => router.push(editUrl)}>
          <Edit className="mr-2 h-4 w-4" />
          Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy {entity.id ? "ID" : "Slug"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => open("confirmDelete", { ...deletePackage })}
        >
          <Trash className="mr-2 h-4 w-4 text-rose-500" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EntityCellAction;
