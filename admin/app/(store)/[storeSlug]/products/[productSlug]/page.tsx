import NotPermitted from "@/components/not-permitted";
import { getClothingProductWithStoreType } from "@/lib/get-products";
import { getCurrentStaffAndStoreType } from "@/lib/get-staffs";
import { canManageProduct } from "@/lib/permission-hierarchy";
import React from "react";
import ClothingProductForm from "./clothing-product-form";
import { ClothingProduct, TechnologyProduct } from "@/types";
import { db } from "@/lib/db";
import { getCategoryAndClothingFieldsInStore } from "@/lib/get-stores";

type Props = {
  params: {
    storeSlug: string;
    productSlug: string;
  };
};

const Product = async ({ params }: Props) => {
  const staff = await getCurrentStaffAndStoreType(params.storeSlug);

  if (!staff) {
    return null;
  }
  const isAuthorized = canManageProduct(staff);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  if (staff.store.storeType === "CLOTHING") {
    const product = await getClothingProductWithStoreType(
      staff.storeId,
      params.productSlug,
    );

    const { categories, colors, sizes } =
      await getCategoryAndClothingFieldsInStore(staff.storeId);

    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          {staff.store.storeType === "CLOTHING" && (
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

  return;
};

export default Product;