import { StoreType } from "@prisma/client";
import { db } from "./db";
import { ClothingProduct, TechnologyProduct } from "@/types";

export async function getProductsWithStoreType(
  storeSlug: string,
  storeType: StoreType,
) {
  if (storeType === "CLOTHING") {
    const products = await db.product.findMany({
      where: {
        store: {
          slug: storeSlug,
        },
      },
      include: {
        color: true,
        size: true,
        category: true,
      },
    });
    return products;
  }
  if (storeType === "TECHNOLOGY") {
    const products = await db.product.findMany({
      where: {
        store: {
          slug: storeSlug,
        },
      },
      include: {
        model: true,
        type: true,
        category: true,
      },
    });
    return products;
  }

  return [] as (ClothingProduct | TechnologyProduct)[];
}

export async function getClothingProductWithStoreType(
  storeId: number,
  slug: string,
) {
  const product = await db.product.findUnique({
    where: {
      slug_storeId: {
        slug,
        storeId,
      },
    },
    include: {
      size: true,
      color: true,
      category: true,
    },
  });
  return product as ClothingProduct | null;
}
