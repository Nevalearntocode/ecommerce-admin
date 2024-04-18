"use client";

import { ColumnDef } from "@tanstack/react-table";

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
];
