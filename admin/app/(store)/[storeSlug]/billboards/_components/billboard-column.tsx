"use client";

import { ColumnDef } from "@tanstack/react-table";
import BillboardCellAction from "./billboard-cell-action";

export type BillboardColumn = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
      <BillboardCellAction formattedBillboard={row.original} />
    ),
  },
];
