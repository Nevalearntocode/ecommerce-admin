"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SizeValue } from "@prisma/client";
import EntityCellAction from "@/components/clients/entity-cell-action";

export type ClothingProductColumn = {
  slug: string;
  name: string;
  category: string;
  isFeatured: boolean;
  isArchived: boolean;
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
    accessorKey: "isFeatured",
    header: "Featured",
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
    accessorKey: "isArchived",
    header: "Archived",
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
      <EntityCellAction
        endpoint="products"
        entity={row.original}
        type="product"
      />
    ),
  },
];
