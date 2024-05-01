import {
  getClothingProductWithStoreType,
  getTechnologyProductWithStoreType,
} from "@/data/get-products";
import React from "react";
import ClothingProductForm from "./clothing-product-form";
import {
  getCategoryAndClothingFieldsInStore,
  getCategoryAndTechnologyFieldsInStore,
} from "@/data/get-stores";
import TechnologyProductForm from "./technology-product-form";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

type Props = {
  params: {
    storeSlug: string;
    productSlug: string;
  };
};

const Product = async ({ params }: Props) => {
  const store = await db.store.findUnique({
    where: {
      slug: params.storeSlug,
    },
  });

  if (!store) {
    return redirect(`/`);
  }

  if (store.storeType === "CLOTHING") {
    const product = await getClothingProductWithStoreType(
      store.id,
      params.productSlug,
    );

    const { categories, colors, sizes } =
      await getCategoryAndClothingFieldsInStore(store.id);

    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {store.storeType === "CLOTHING" && (
            <ClothingProductForm
              product={product}
              categories={categories}
              sizes={sizes}
              colors={colors}
            />
          )}
        </div>
      </div>
    );
  }
  if (store.storeType === "TECHNOLOGY") {
    const product = await getTechnologyProductWithStoreType(
      store.id,
      params.productSlug,
    );

    const { categories, models, types } =
      await getCategoryAndTechnologyFieldsInStore(store.id);

    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {store.storeType === "TECHNOLOGY" && (
            <TechnologyProductForm
              product={product}
              categories={categories}
              models={models}
              types={types}
            />
          )}
        </div>
      </div>
    );
  }

  return;
};

export default Product;
