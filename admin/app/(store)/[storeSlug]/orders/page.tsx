import React from "react";
import OrderClient from "./order-client";

type Props = {};

const Orders = async ({}: Props) => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient />
      </div>
    </div>
  );
};

export default Orders;
