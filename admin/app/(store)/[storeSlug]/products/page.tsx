import {
  getClothingProductsWithStoreType,
  getTechnologyProductsWithStoreType,
} from "@/data/get-products";
import React from "react";
import ClothingProductClient from "./_components/clothing/clothing-product-client";
import TechnologyProductClient from "./_components/technology/technology-product-client";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Products = async ({ params }: Props) => {
  const store = await db.store.findUnique({
    where: {
      slug: params.storeSlug,
    },
  });

  if (!store) {
    return redirect(`/`);
  }

  if (store.storeType === "CLOTHING") {
    const products = await getClothingProductsWithStoreType(store.id);
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ClothingProductClient clothingProducts={products} />
        </div>
      </div>
    );
  }

  if (store.storeType === "TECHNOLOGY") {
    const products = await getTechnologyProductsWithStoreType(store.id);
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <TechnologyProductClient technologyProducts={products} />
        </div>
      </div>
    );
  }
};

export default Products;
