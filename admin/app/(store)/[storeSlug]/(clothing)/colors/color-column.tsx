"use client";

import { ColumnDef } from "@tanstack/react-table";
import ColorCellAction from "./color-cell-action";

export type ColorColumn = {
  id: number;
  name: string;
  value: string,
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Color",
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
      <ColorCellAction formattedColor={row.original} />
    ),
  },
];
