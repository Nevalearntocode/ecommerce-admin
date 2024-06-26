"use client";

import { ColumnDef } from "@tanstack/react-table";
import EntityCellAction from "@/components/clients/entity-cell-action";

export type CategoryColumn = {
  slug: string;
  name: string;
  billboardName: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboardName",
    header: "Billboard",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
  },
  {
    accessorKey: "createdAt",
    header: "Created",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <EntityCellAction endpoint="categories" entity={row.original} type="general" />
    ),
  },
];
