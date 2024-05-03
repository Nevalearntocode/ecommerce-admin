"use client";

import { useStoreContext } from "@/contexts/store-context";
import React from "react";
import ClothingProductClient from "./clothing/clothing-product-client";
import { ClothingProduct, TechnologyProduct } from "@/types";
import TechnologyProductClient from "./technology/technology-product-client";

type Props = {};

const ProductsDisplay = (props: Props) => {
  const { storeType } = useStoreContext().store;
  const { products } = useStoreContext();

  if (storeType === "CLOTHING") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ClothingProductClient
            clothingProducts={products as ClothingProduct[]}
          />
        </div>
      </div>
    );
  }

  if (storeType === "TECHNOLOGY") {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <TechnologyProductClient
            technologyProducts={products as TechnologyProduct[]}
          />
        </div>
      </div>
    );
  }
};

export default ProductsDisplay;
