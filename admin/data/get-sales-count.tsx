import { db } from "@/lib/db";

export const getStoreSalesCount = async (storeId: number) => {
  const salesCount = await db.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  });

  return salesCount;
};
