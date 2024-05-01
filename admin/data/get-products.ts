import { StoreType } from "@prisma/client";
import { db } from "../lib/db";
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
