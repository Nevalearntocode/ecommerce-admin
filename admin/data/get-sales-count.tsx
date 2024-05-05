import { db } from "@/lib/db";

export const getStoreSalesCount = async (slug: string) => {
  const salesCount = await db.order.count({
    where: {
      store: {
        slug
      },
      isPaid: true,
    },
  });

  return salesCount;
};
