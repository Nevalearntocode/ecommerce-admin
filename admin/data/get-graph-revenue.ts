import { db } from "@/lib/db";

export type GraphData = {
  name: string;
  total: number;
};

/**
 * Retrieves the graph data for revenue based on paid orders.
 * @param storeId - The ID of the store.
 * @returns An array of graph data objects representing the monthly revenue.
 */
export const getMonthlyGraphRevenue = async (slug: string) => {
  const paidOrders = await db.order.findMany({
    where: {
      store: {
        slug,
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

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueForOrder = 0;

    for (const orderItem of order.orderItems) {
      revenueForOrder += orderItem.quantity * orderItem.product.price;
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  const graphData: GraphData[] = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  for (const key in monthlyRevenue) {
    graphData[parseInt(key)].total = monthlyRevenue[key];
  }

  return graphData;
};
