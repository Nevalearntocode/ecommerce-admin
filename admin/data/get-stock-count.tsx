import { db } from "@/lib/db";

export const getStockCount = async (slug: string) => {
  const products = await db.product.findMany({
    where: {
      store: {
        slug
      },
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
