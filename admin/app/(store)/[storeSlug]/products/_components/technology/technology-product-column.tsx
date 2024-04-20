"use client";

import { ColumnDef } from "@tanstack/react-table";
import TechnologyProductCellAction from "./technology-product-cell-action";
import { SizeValue } from "@prisma/client";

export type TechnologyProductColumn = {
  slug: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  type: string;
  price: number;
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
      <TechnologyProductCellAction formattedTechnologyProduct={row.original} />
    ),
  },
];
