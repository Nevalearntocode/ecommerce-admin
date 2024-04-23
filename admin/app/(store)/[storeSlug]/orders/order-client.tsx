"use client";

import { Separator } from "@/components/ui/separator";
import { Order, OrderItem, Product } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { OrderColumn, columns } from "./order-column";
import { format } from "date-fns";
import { DataTable } from "@/components/clients/datatable";
import useFilter from "@/hooks/use-filter";
import HeaderWithActions from "@/components/clients/header-with-actions";
import SearchInput from "@/components/clients/search";
import { formatter } from "@/lib/utils";

type Props = {
  orders: (Order & {
    orderItems: (OrderItem & {
      product: Product;
    })[];
  })[];
};

const OrderClient = ({ orders }: Props) => {
  const { setSearchInput, filteredItems: filteredOrders } = useFilter(
    orders,
    "phone",
  );

  const router = useRouter();
  const params = useParams();

  const formattedOrders: OrderColumn[] = useMemo(() => {
    return filteredOrders.map((order) => ({
      id: order.id,
      name: order.customer,
      phone: order.phone,
      address: order.address,
      totalPrice: formatter.format(
        order.orderItems.reduce((total, item) => {
          return (total = Number(item.product.price));
        }, 0),
      ),
      isPaid: order.isPaid,
      products: order.orderItems.map((item) => item.product.name).join(", "),
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
        actions={[
          {
            label: "Add new",
            icon: <Plus className="mr-2 h-4 w-4" />,
            onClick: () => router.push(`/${params.storeSlug}/orders/new`),
          },
        ]}
      />
      <Separator />
      {/* Search */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SearchInput
          onChange={setSearchInput}
          component="order"
          noName={true}
        />
      </div>
      <DataTable columns={columns} data={formattedOrders} />
    </>
  );
};

export default OrderClient;
