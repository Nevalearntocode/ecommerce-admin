import React from "react";
import SizeClient from "./size-client";
import { getCurrentStaffAndStoreType } from "@/lib/get-staffs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { canManageProduct, isOwner } from "@/lib/permission-hierarchy";
import NotPermitted from "@/components/mainpages/not-permitted";

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
  const isAuthorized =
    canManageProduct(staff) || isOwner(staff, staff.store.userId);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  if (staff.store.storeType !== "CLOTHING") {
    return redirect(`/${params.storeSlug}`);
  }

  const sizes = await db.size.findMany({
    where: {
      store: {
        slug: params.storeSlug,
      },
    },
    orderBy: {
      value: "asc",
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
