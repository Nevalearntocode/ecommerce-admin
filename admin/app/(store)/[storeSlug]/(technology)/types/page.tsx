import React from "react";
import TypeClient from "./type-client";
import { getCurrentStaffAndStoreType } from "@/data/get-staffs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { canManageProduct, isOwner } from "@/permissions/permission-hierarchy";
import NotPermitted from "@/components/mainpages/not-permitted";

type Props = {
  params: {
    storeSlug: string;
  };
};

const Types = async ({ params }: Props) => {
  const staff = await getCurrentStaffAndStoreType(params.storeSlug);

  if (!staff) {
    return redirect(`/${params.storeSlug}`);
  }
  const isAuthorized =
    canManageProduct(staff) || isOwner(staff.userId, staff.store.userId);

  if (!isAuthorized) {
    return <NotPermitted />;
  }

  if (staff.store.storeType !== "TECHNOLOGY") {
    return redirect(`/${params.storeSlug}`);
  }

  const types = await db.type.findMany({
    where: {
      store: {
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
        <TypeClient types={types} />
      </div>
    </div>
  );
};

export default Types;
