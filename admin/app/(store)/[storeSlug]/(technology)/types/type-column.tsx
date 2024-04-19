"use client";

import { ColumnDef } from "@tanstack/react-table";
import TypeCellAction from "./type-cell-action";

export type TypeColumn = {
  id: number;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<TypeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Type",
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
    cell: ({ row }) => <TypeCellAction formattedType={row.original} />,
  },
];
