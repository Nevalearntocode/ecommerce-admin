"use client";

import { ColumnDef } from "@tanstack/react-table";
import ModelCellAction from "./model-cell-action";

export type ModelColumn = {
  id: number;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<ModelColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Model",
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
    cell: ({ row }) => <ModelCellAction formattedModel={row.original} />,
  },
];
