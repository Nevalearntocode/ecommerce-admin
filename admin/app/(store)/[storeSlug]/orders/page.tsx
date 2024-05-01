import React from "react";
import OrderClient from "./order-client";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Orders = async ({ params }: Props) => {

  const store = await db.store.findUnique({
    where: {
      slug: params.storeSlug,
    },
    include: {
      orders: {
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      }
    }
  })

  if(!store){
    return redirect(`/`)
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient orders={store.orders} />
      </div>
    </div>
  );
};

export default Orders;
