"use client";

import { Separator } from "@/components/ui/separator";
import React, { useMemo } from "react";
import { OrderColumn, columns } from "./order-column";
import { format } from "date-fns";
import { DataTable } from "@/components/clients/datatable";
import useFilter from "@/hooks/use-filter";
import HeaderWithActions from "@/components/clients/header-with-actions";
import SearchInput from "@/components/clients/search";
import { formatter } from "@/lib/utils";
import { useStoreContext } from "@/contexts/store-context";

type Props = {};

const OrderClient = ({}: Props) => {
  const { orders } = useStoreContext().store;

  const { setSearchInput, filteredItems: filteredOrders } = useFilter(
    orders,
    "customer",
  );

  const formattedOrders: OrderColumn[] = useMemo(() => {
    return filteredOrders.map((order) => ({
      id: order.id,
      name: order.customer,
      email: order.email,
      phone: order.phone,
      address: order.address,
      totalPrice: formatter.format(
        order.orderItems.reduce((total, item) => {
          return (total += Number(item.product.price) * item.quantity);
        }, 0),
      ),
      isPaid: order.isPaid,
      products: order.orderItems
        .map((item) => `${item.quantity} ${item.product.name}`)
        .join(", "),
      createdAt: format(order.createdAt, "h:mm MMMM do, yyyy"),
    }));
  }, [filteredOrders]);

  return (
    <>
      <HeaderWithActions
        title={
          orders.length <= 1
            ? `Order (${orders.length})`
            : `Orders (${orders.length})`
        }
        description="Manage your orders for your store"
      />
      <Separator />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SearchInput
          onChange={setSearchInput}
          component="order"
          noName={false}
        />
      </div>
      <DataTable columns={columns} data={formattedOrders} />
    </>
  );
};

export default OrderClient;
