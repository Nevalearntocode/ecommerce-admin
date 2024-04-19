import NotPermitted from "@/components/not-permitted";
import { getProductsWithStoreType } from "@/lib/get-products";
import { getCurrentStaffAndStoreType } from "@/lib/get-staffs";
import { canManageProduct } from "@/lib/permission-hierarchy";
import React from "react";
import ProductClient from "./product-client";
import { ClothingProduct, TechnologyProduct } from "@/types";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Products = async ({ params }: Props) => {
  const staff = await getCurrentStaffAndStoreType(params.storeSlug);

  if (!staff) {
    return null;
  }
  const isAuthorized = canManageProduct(staff);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  const products = await getProductsWithStoreType(
    params.storeSlug,
    staff.store.storeType,
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient products={products} />
      </div>
    </div>
  );
};

export default Products;
