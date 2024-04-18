import React from "react";
import SizeClient from "./size-client";
import { getCurrentStaffAndStoreType } from "@/lib/get-staffs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Sizes = async ({ params }: Props) => {
  const staff = await getCurrentStaffAndStoreType(params.storeSlug);
  if (!staff) {
    return null;
  }

  if (staff.store.storeType === "TECHNOLOGY") {
    return redirect(`/${params.storeSlug}`);
  }

  const sizes = await db.size.findMany({
    where: {
      Store: {
        slug: params.storeSlug,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient sizes={sizes} />
      </div>
    </div>
  );
};

export default Sizes;
