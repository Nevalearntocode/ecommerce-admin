"use client";

import { ColumnDef } from "@tanstack/react-table";
import SizeCellAction from "./size-cell-action";
import { SizeValue } from "@prisma/client";

export type SizeColumn = {
  id: number;
  name: string;
  value: SizeValue,
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Size",
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
      <SizeCellAction formattedSize={row.original} />
    ),
  },
];
