import { db } from "@/lib/db";

export const getStoreTotalRevenue = async (slug: string) => {
  const paidOrders = await db.order.findMany({
    where: {
      store: {
        slug
      },
      isPaid: true,
    },
    include: {
      orderItems: {
        select: {
          quantity: true,
          product: {
            select: {
              price: true,
            },
          },
        },
      },
    },
  });

    const totalRevenue = paidOrders.reduce((acc, order) => {
        const orderTotal = order.orderItems.reduce((acc, item) => {
        return acc + item.quantity * item.product.price;
        }, 0);
        return acc + orderTotal;
    }, 0);

    return totalRevenue;
};
