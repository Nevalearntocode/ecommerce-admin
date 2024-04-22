"use client";

import { ColumnDef } from "@tanstack/react-table";
import EntityCellAction from "@/components/clients/entity-cell-action";

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
      <EntityCellAction
        endpoint="billboards"
        entity={row.original}
        type="general"
      />
    ),
  },
];
