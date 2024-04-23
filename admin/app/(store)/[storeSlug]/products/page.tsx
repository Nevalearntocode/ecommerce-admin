import NotPermitted from "@/components/mainpages/not-permitted";
import {
  getClothingProductsWithStoreType,
  getTechnologyProductsWithStoreType,
} from "@/data/get-products";
import { getCurrentStaffAndStoreType } from "@/data/get-staffs";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";
import React from "react";
import ClothingProductClient from "./_components/clothing/clothing-product-client";
import TechnologyProductClient from "./_components/technology/technology-product-client";

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
  const isAuthorized =
    canManageProduct(staff) || isOwner(staff.userId, staff.store.userId);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  if (staff.store.storeType === "CLOTHING") {
    const products = await getClothingProductsWithStoreType(staff.storeId);
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ClothingProductClient clothingProducts={products} />
        </div>
      </div>
    );
  }

  if (staff.store.storeType === "TECHNOLOGY") {
    const products = await getTechnologyProductsWithStoreType(staff.storeId);
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
