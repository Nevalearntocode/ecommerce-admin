"use client";

import React from "react";
import { CategoryColumn } from "./category-column";
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
  formattedCategory: CategoryColumn;
};

const CategoryCellAction = ({ formattedCategory }: Props) => {
  const { open, close } = useModal();
  const router = useRouter();
  const params = useParams();
  const onCopy = () => {
    navigator.clipboard.writeText(formattedCategory.slug);
    toast.success("Category Slug copied to clipboard.");
  };

  const onDelete = async () => {
    try {
      const res = await axios.delete(
        `/api/store/${params.storeSlug}/categories/${formattedCategory.slug}`,
      );
      toast.success(res.data.success);
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
    descriptionDelete: `Deleting "${formattedCategory.name}" will permanently remove it and all its content. This is irreversible.`,
  };

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
        <DropdownMenuItem
          onClick={() =>
            router.push(
              `/${params.storeSlug}/categories/${formattedCategory.slug}`,
            )
          }
        >
          <Edit className="mr-2 h-4 w-4" />
          Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopy}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Slug
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

export default CategoryCellAction;
