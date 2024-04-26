"use client";

import EntityCellAction from "@/components/clients/entity-cell-action";
import { ColumnDef } from "@tanstack/react-table";
import OrderCellAction from "./order-cell-action";

export type OrderColumn = {
  id: number;
  name: string;
  phone: string;
  email: string
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "phone",
    header: "Phone number",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <OrderCellAction
        endpoint="orders"
        entity={row.original}
      />
    ),
  },
];
