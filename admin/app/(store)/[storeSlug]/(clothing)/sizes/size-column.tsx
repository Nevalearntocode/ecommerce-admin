"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SizeValue } from "@prisma/client";
import EntityCellAction from "@/components/clients/entity-cell-action";

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
      <EntityCellAction endpoint="sizes" entity={row.original} type="general" />
    ),
  },
];
