import NotPermitted from "@/components/mainpages/not-permitted";
import { getStoreOrders } from "@/data/get-orders";
import { getCurrentStaffAndStoreType } from "@/data/get-staffs";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";
import React from "react";
import OrderClient from "./order-client";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Orders = async ({ params }: Props) => {
  const staff = await getCurrentStaffAndStoreType(params.storeSlug);

  if (!staff) {
    return null;
  }
  const isAuthorized =
    canManageProduct(staff) || isOwner(staff.userId, staff.store.userId);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  const orders = await getStoreOrders(staff.storeId)

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient orders={orders} />
      </div>
    </div>
  );
};

export default Orders;
