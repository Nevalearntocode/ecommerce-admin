"use client";

import { ColumnDef } from "@tanstack/react-table";
import EntityCellAction from "@/components/clients/entity-cell-action";

export type TechnologyProductColumn = {
  slug: string;
  name: string;
  category: string;
  isFeatured: boolean;
  isArchived: boolean;
  brand: string;
  model: string;
  type: string;
  price: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<TechnologyProductColumn>[] = [
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
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "type",
    header: "Type",
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
