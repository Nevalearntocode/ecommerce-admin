import { StoreType } from "@prisma/client";
import { db } from "./db";
import { ClothingProduct, TechnologyProduct } from "@/types";

export async function getTechnologyProductsWithStoreType(storeId: number) {
  const products = await db.product.findMany({
    where: {
      storeId,
    },
    include: {
      model: true,
      type: true,
      category: true,
    },
  });
  return products as TechnologyProduct[];
}
export async function getClothingProductsWithStoreType(storeId: number) {
  const products = await db.product.findMany({
    where: {
      storeId,
    },
    include: {
      size: true,
      color: true,
      category: true,
    },
  });
  return products as ClothingProduct[];
}

export async function getTechnologyProductWithStoreType(
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
      model: true,
      type: true,
      category: true,
    },
  });
  return product as TechnologyProduct | null;
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

export async function getProductUsingStoreType<T extends ClothingProduct | TechnologyProduct>(
  storeId: number,
  slug: string,
  storeType: StoreType,
) {
  if (storeType == "CLOTHING") {
    const product = await getClothingProductWithStoreType(storeId, slug);

    return product;
  }
  if (storeType == "TECHNOLOGY") {
    const product = await getTechnologyProductWithStoreType(storeId, slug);
    return product;
  }
}
