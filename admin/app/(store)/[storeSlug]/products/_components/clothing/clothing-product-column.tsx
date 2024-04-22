"use client";

import { ColumnDef } from "@tanstack/react-table";
import ClothingProductCellAction from "./clothing-product-cell-action";
import { SizeValue } from "@prisma/client";

export type ClothingProductColumn = {
  slug: string;
  name: string;
  category: string;
  brand: string;
  size: SizeValue;
  color: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<ClothingProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "value",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <p>{row.original.color}</p>
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "createdAt",
    header: "Create",
  },
  {
    accessorKey: "updatedAt",
    header: "Update",
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <ClothingProductCellAction formattedClothingProduct={row.original} />
    ),
  },
];