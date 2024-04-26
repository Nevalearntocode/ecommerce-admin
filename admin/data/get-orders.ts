import { db } from "@/lib/db";

export async function getStoreOrders(storeId: number) {
  const orders = await db.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      isPaid: "asc",
    },
  });

  return orders;
}
