import { db } from "@/lib/db";

export const getStockCount = async (storeId: number) => {
  const products = await db.product.findMany({
    where: {
      storeId,
      stock: {
        gt: 0,
      },
      isArchived: false,
    },
    select: {
      slug: true,
      name: true,
      stock: true,
    },
  });

  return products

};
