"use client";

import { ColumnDef } from "@tanstack/react-table";
import EntityCellAction from "@/components/clients/entity-cell-action";

export type OrderColumn = {
  id: number;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: number
  products: string
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <EntityCellAction
        endpoint="orders"
        entity={row.original}
      />
    ),
  },
];
