"use client";

import { useStoreContext } from "@/contexts/store-context";
import { useParams } from "next/navigation";
import React from "react";
import ClothingProductForm from "./clothing-product-form";
import TechnologyProductForm from "./technology-product-form";
import { ClothingProduct, TechnologyProduct } from "@/types";

type Props = {};

const ProductForms = (props: Props) => {
  const { storeType, categories, colors, sizes, models, types } = useStoreContext().store;
  const { products } = useStoreContext();
  const params = useParams()
  const product = products.find(product => product.slug === params.productSlug)

  if (storeType === "CLOTHING") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {storeType === "CLOTHING" && (
            <ClothingProductForm
              product={product as ClothingProduct | undefined}
              categories={categories}
              sizes={sizes}
              colors={colors}
            />
          )}
        </div>
      </div>
    );
  }
  if (storeType === "TECHNOLOGY") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {storeType === "TECHNOLOGY" && (
            <TechnologyProductForm
              product={product as TechnologyProduct | undefined}
              categories={categories}
              models={models}
              types={types}
            />
          )}
        </div>
      </div>
    );
  }
};

export default ProductForms;
