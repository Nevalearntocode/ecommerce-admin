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
import { ClothingProductColumn } from "./clothing-product-column";

type Props = {
  formattedClothingProduct: ClothingProductColumn;
};

const ClothingProductCellAction = ({ formattedClothingProduct }: Props) => {
  const { open, close } = useModal();
  const router = useRouter();
  const params = useParams();
  const onCopy = () => {
    navigator.clipboard.writeText(formattedClothingProduct.slug.toString());
    toast.success("Product slug copied to clipboard.");
  };

  const onDelete = async () => {
    try {
      console.log("Delete");
      const res = await axios.delete(
        `/api/store/${params.storeSlug}/products/${formattedClothingProduct?.slug}`,
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
    descriptionDelete: `"${formattedClothingProduct?.name}" Will permanently be removed. This is irreversible.`,
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
              `/${params.storeSlug}/products/${formattedClothingProduct.slug}`,
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

export default ClothingProductCellAction;