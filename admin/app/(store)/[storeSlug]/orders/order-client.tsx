"use client";

import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import { Order, OrderItem, Product } from "@prisma/client";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { OrderColumn, columns } from "./order-column";
import { format } from "date-fns";
import { DataTable } from "@/components/clients/datatable";
import APIList from "@/components/apis/api-list";
import useFilter from "@/hooks/use-filter";
import Pagination from "@/components/clients/pagination";
import useDefaultView from "@/hooks/use-default-view";
import HeaderWithActions from "@/components/clients/header-with-actions";
import SearchInput from "@/components/clients/search";
import GeneralCard from "@/components/clients/general-card";
import usePagination from "@/hooks/use-pagination";
import NoResults from "@/components/clients/no-results";

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
  const { currentItems, currentPage, handlePageChange, totalPages } =
    usePagination(filteredOrders);

  const router = useRouter();
  const params = useParams();

  const formattedOrders: OrderColumn[] = useMemo(() => {
    return filteredOrders.map((order) => ({
      id: order.id,
      phone: order.phone,
      address: order.address,
      totalPrice: order.orderItems.reduce((total, item) => {
        return total = Number(item.product.price)
      }, 0),
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
        <SearchInput onChange={setSearchInput} component="order" />
      </div>
      <DataTable columns={columns} data={formattedOrders} />
      <Header title="API" description="API calls for Orders" />
      <APIList name="orders" id="order-id" />
    </>
  );
};

export default OrderClient;
