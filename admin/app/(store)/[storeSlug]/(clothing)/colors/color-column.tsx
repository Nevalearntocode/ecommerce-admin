"use client";

import { ColumnDef } from "@tanstack/react-table";
import ColorCellAction from "./color-cell-action";

export type ColorColumn = {
  id: number;
  name: string;
  value: string;
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
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <p>{row.original.value}</p>
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        />
      </div>
    ),
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
    cell: ({ row }) => <ColorCellAction formattedColor={row.original} />,
  },
];
