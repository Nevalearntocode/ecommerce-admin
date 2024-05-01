import React from "react";
import { getCurrentStaff } from "@/data/get-staffs";
import { canManageCategory, isOwner } from "@/permissions/permission-hierarchy";
import NotPermitted from "@/components/mainpages/not-permitted";
import { db } from "@/lib/db";
import CategoryClient from "./category-client";
import { redirect } from "next/navigation";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Categories = async ({ params }: Props) => {
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

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient categories={categories} />
      </div>
    </div>
  );
};

export default Categories;
