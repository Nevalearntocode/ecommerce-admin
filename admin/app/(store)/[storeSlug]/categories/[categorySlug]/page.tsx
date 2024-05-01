import React from "react";
import CategoryForm from "./category-form";
import { getCurrentStaff } from "@/data/get-staffs";
import { canManageCategory, isOwner } from "@/permissions/permission-hierarchy";
import NotPermitted from "@/components/mainpages/not-permitted";
import { getCategoryByStoreSlugAndCategorySlug } from "@/data/get-categories";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: {
    categorySlug: string;
    storeSlug: string;
  };
};

const CategoryPage = async ({ params }: Props) => {
  const category = await getCategoryByStoreSlugAndCategorySlug(
    params.storeSlug,
    params.categorySlug,
  );

  const billboardNames = await db.billboard.findMany({
    where: {
      store: {
        slug: params.storeSlug,
      },
    },
    select: {
      name: true,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm category={category} billboardNames={billboardNames} />
      </div>
    </div>
  );
};

export default CategoryPage;
