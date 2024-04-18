import React from "react";
import { getCurrentStaff } from "@/lib/get-staffs";
import { canManageCategory } from "@/lib/permission-hierarchy";
import NotPermitted from "@/components/not-permitted";
import { db } from "@/lib/db";
import CategoryClient from "./category-client";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Categories = async ({ params }: Props) => {
  const staff = await getCurrentStaff(params.storeSlug);
  if (!staff) {
    return null;
  }
  const categories = await db.category.findMany({
    where: {
      store: {
        slug: params.storeSlug,
      },
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const isAuthorized = canManageCategory(staff);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient categories={categories} />
      </div>
    </div>
  );
};

export default Categories;
